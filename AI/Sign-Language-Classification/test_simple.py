import cv2
import mediapipe as mp
import numpy as np
import tempfile
import os
import traceback
import time
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, StreamingResponse
import uvicorn
import asyncio
from concurrent.futures import ThreadPoolExecutor
import logging
from typing import List, Dict, Any
from pydantic import BaseModel
from pydantic import BaseModel
from typing import List, Optional
from utils.conversion import convert_to_mp_face_results, convert_to_mp_hand_results


# Import utils
from utils.feature_extraction import extract_features
from utils.strings import ExpressionHandler
from utils.model import ASLClassificationModel
from config import (
    MODEL_NAME,
    MODEL_CONFIDENCE,
    MAX_PROCESSING_TIME,
    TARGET_FPS,
    MIN_FRAME_COUNT,
)

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize MediaPipe components
mp_face_mesh = mp.solutions.face_mesh
mp_hands = mp.solutions.hands

from fastapi.middleware.cors import CORSMiddleware

# Khởi tạo app
app = FastAPI(title="ASL Video Processing API")

# Thêm CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global thread pool for CPU-bound tasks
thread_pool = ThreadPoolExecutor(max_workers=4)


class Landmark(BaseModel):
    x: float
    y: float
    z: Optional[float] = 0.0


class HandLandmarks(BaseModel):
    landmarks: List[Landmark]
    handedness: Optional[str] = None


class PredictionRequest(BaseModel):
    face_landmarks: List[Landmark]
    hand_landmarks: List[HandLandmarks]
    word: str


# Load model globally
logger.info("🔄 Loading model...")
try:
    model = ASLClassificationModel.load_model(f"models/{MODEL_NAME}")
    logger.info("✅ Model loaded successfully")
except Exception as e:
    logger.error(f"❌ Error loading model: {e}")
    traceback.print_exc()

    # Fallback to dummy model
    class DummyModel:
        def predict(self, feature):
            return "A"  # Default prediction

    model = DummyModel()


@app.get("/")
def read_root():
    return {"message": "ASL Video Processing API", "status": "running"}


@app.post("/process-video")
async def process_video(
    background_tasks: BackgroundTasks, file: UploadFile = File(...)
):
    """Process video and return ASL prediction"""
    try:
        # Validate file type
        if not file.content_type.startswith("video/"):
            raise HTTPException(400, "Invalid file format. Please upload a video file.")

        # Save uploaded video to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name

        # Process the video in background with timeout
        try:
            # Use thread pool for CPU-intensive task
            loop = asyncio.get_event_loop()
            results = await asyncio.wait_for(
                loop.run_in_executor(thread_pool, process_video_file, tmp_file_path),
                timeout=MAX_PROCESSING_TIME,
            )
        except asyncio.TimeoutError:
            raise HTTPException(408, "Video processing timeout")
        finally:
            # Clean up in background
            background_tasks.add_task(cleanup_file, tmp_file_path)

        return JSONResponse(
            content={
                "success": True,
                "recognized_sequence": results["sequence"],
                "details": {
                    "processing_time": results["processing_time"],
                    "frames_processed": results["frames_processed"],
                    "original_duration": results["original_duration"],
                    "original_fps": results["original_fps"],
                    "raw_predictions": results["raw_predictions"],  # For debugging
                },
            }
        )

    except Exception as e:
        # Clean up on error
        if "tmp_file_path" in locals() and os.path.exists(tmp_file_path):
            background_tasks.add_task(cleanup_file, tmp_file_path)
        logger.error(f"Error processing video: {str(e)}")
        raise HTTPException(500, f"Error processing video: {str(e)}")


async def cleanup_file(file_path: str):
    """Clean up temporary file with retry logic"""
    for _ in range(3):  # Try 3 times
        try:
            if os.path.exists(file_path):
                os.unlink(file_path)
                break
        except Exception as e:
            logger.warning(f"Failed to delete temp file: {e}")
            await asyncio.sleep(0.1)  # Wait a bit before retrying


def process_video_file(video_path: str) -> Dict[str, Any]:
    """Process video file with optimizations"""
    start_time = time.time()

    # Initialize MediaPipe
    face_mesh = mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=MODEL_CONFIDENCE,
        min_tracking_confidence=MODEL_CONFIDENCE,
    )

    hands = mp_hands.Hands(
        max_num_hands=2,
        min_detection_confidence=MODEL_CONFIDENCE,
        min_tracking_confidence=MODEL_CONFIDENCE,
    )

    # Sử dụng ExpressionHandler mới với thời gian tối thiểu cho mỗi cử chỉ
    expression_handler = ExpressionHandler(min_frames_per_gesture=2)
    processed_frames = 0

    try:
        # Open video file
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception("Cannot open video file")

        # Get video properties
        original_fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count / original_fps if original_fps > 0 else 0

        # Calculate frame sampling rate
        sample_every_n_frames = max(1, int(original_fps / TARGET_FPS))
        logger.info(
            f"Original FPS: {original_fps}, Sampling every {sample_every_n_frames} frames"
        )

        # Process frames with sampling
        frame_idx = 0
        frame_predictions = []  # Lưu tất cả predictions để debug

        while True:
            success, image = cap.read()
            if not success:
                break

            # Skip frames based on sampling rate
            if frame_idx % sample_every_n_frames != 0:
                frame_idx += 1
                continue

            # Check processing time limit
            if time.time() - start_time > MAX_PROCESSING_TIME - 1:
                logger.warning("Processing time limit reached, stopping early")
                break

            # Convert to RGB and resize
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            height, width = image_rgb.shape[:2]
            if width > 640:
                scale = 640 / width
                new_width = 640
                new_height = int(height * scale)
                image_rgb = cv2.resize(image_rgb, (new_width, new_height))

            # Process with MediaPipe
            face_results = face_mesh.process(image_rgb)
            hand_results = hands.process(image_rgb)

            # Extract features and predict
            try:
                feature = extract_features(mp_hands, face_results, hand_results)
                if feature is not None:
                    # Chuyển đổi số thành chữ cái nếu cần
                    prediction = model.predict(feature)
                    if isinstance(prediction, (int, float, np.number)):
                        # Mapping từ số sang chữ cái
                        prediction = chr(65 + int(prediction))  # 0->A, 1->B, ...

                    expression_handler.receive(prediction)
                    frame_predictions.append(prediction)
                else:
                    expression_handler.receive("?")
                    frame_predictions.append("?")
            except Exception as e:
                logger.warning(f"Error in frame {frame_idx}: {e}")
                expression_handler.receive("!")
                frame_predictions.append("!")

            processed_frames += 1

            # Break if we have enough frames
            if processed_frames >= MIN_FRAME_COUNT and duration > 0:
                break

            frame_idx += 1

        # Get final sequence
        final_sequence = expression_handler.get_sequence()
        processing_time = time.time() - start_time

        logger.info(f"Processed {processed_frames} frames in {processing_time:.2f}s")
        logger.info(f"Raw predictions: {''.join(frame_predictions)}")
        logger.info(f"Final sequence: {final_sequence}")

        return {
            "sequence": final_sequence,
            "raw_predictions": "".join(frame_predictions),
            "processing_time": f"{processing_time:.2f}s",
            "frames_processed": processed_frames,
            "original_duration": f"{duration:.2f}s",
            "original_fps": original_fps,
        }

    finally:
        # Release resources
        if "cap" in locals() and cap.isOpened():
            cap.release()
        face_mesh.close()
        hands.close()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "model_loaded": not isinstance(model, DummyModel)}


@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        # Tái tạo cấu trúc MediaPipe results
        face_results = convert_to_mp_face_results(request.face_landmarks)
        hand_results = convert_to_mp_hand_results(request.hand_landmarks)

        # Trích xuất features
        feature = extract_features(mp_hands, face_results, hand_results)
        if feature is None:
            return {"accuracy": 0.0, "message": "No face/hands detected"}

        # Dự đoán
        prediction = model.predict(feature)
        predicted_word = prediction.lower().strip()

        # Tính accuracy
        accuracy = 1.0 if request.word.lower() == predicted_word else 0.0

        return {
            "input_word": request.word,
            "predicted_word": predicted_word,
            "accuracy": accuracy,
            "success": True,
        }

    except Exception as e:
        return {"error": str(e), "success": False}


if __name__ == "__main__":
    logger.info("🚀 Starting ASL API Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

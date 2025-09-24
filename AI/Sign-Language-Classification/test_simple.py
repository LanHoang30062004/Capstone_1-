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
    MAX_CONCURRENT_VIDEOS,
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


@app.get("/")
def read_root():
    return {"message": "ASL Video Processing API", "status": "running"}


@app.post("/process-videos")
async def process_videos(
    background_tasks: BackgroundTasks, files: List[UploadFile] = File(...)
):
    """Process multiple videos and return combined ASL prediction"""
    try:
        # Validate that files are provided
        if not files:
            raise HTTPException(400, "No files provided")

        # Validate file types
        for file in files:
            if not file.content_type.startswith("video/"):
                raise HTTPException(
                    400,
                    f"Invalid file format for {file.filename}. Please upload video files only.",
                )

        temp_files = []  # Track all temporary files for cleanup
        all_sequences = []  # Store sequences from all videos
        combined_details = {
            "total_processing_time": 0,
            "total_frames_processed": 0,
            "total_original_duration": 0,
            "videos_processed": 0,
            "individual_results": [],
        }

        # Process each video file sequentially
        for file in files:
            tmp_file_path = None
            try:
                # Save uploaded video to temporary file
                with tempfile.NamedTemporaryFile(
                    delete=False, suffix=".mp4"
                ) as tmp_file:
                    content = await file.read()
                    tmp_file.write(content)
                    tmp_file_path = tmp_file.name
                    temp_files.append(tmp_file_path)

                # Process the video in background with timeout
                loop = asyncio.get_event_loop()
                video_result = await asyncio.wait_for(
                    loop.run_in_executor(
                        thread_pool, process_video_file, tmp_file_path
                    ),
                    timeout=MAX_PROCESSING_TIME,
                )

                # Add sequence to combined result
                if video_result["sequence"]:  # Only add non-empty sequences
                    all_sequences.append(video_result["sequence"])

                # Update combined details
                combined_details["total_processing_time"] += float(
                    video_result["processing_time"].replace("s", "")
                )
                combined_details["total_frames_processed"] += video_result[
                    "frames_processed"
                ]
                combined_details["total_original_duration"] += float(
                    video_result["original_duration"].replace("s", "")
                )
                combined_details["videos_processed"] += 1

                # Store individual video results for debugging
                combined_details["individual_results"].append(
                    {
                        "filename": file.filename,
                        "sequence": video_result["sequence"],
                        "processing_time": video_result["processing_time"],
                        "frames_processed": video_result["frames_processed"],
                        "original_duration": video_result["original_duration"],
                        "original_fps": video_result["original_fps"],
                    }
                )

            except asyncio.TimeoutError:
                # Skip this video but continue processing others
                logger.warning(f"Timeout processing video: {file.filename}")
                combined_details["individual_results"].append(
                    {
                        "filename": file.filename,
                        "error": "Video processing timeout",
                        "sequence": "",
                    }
                )
            except Exception as e:
                # Skip this video but continue processing others
                logger.error(f"Error processing video {file.filename}: {str(e)}")
                combined_details["individual_results"].append(
                    {
                        "filename": file.filename,
                        "error": f"Error processing video: {str(e)}",
                        "sequence": "",
                    }
                )

        # Clean up all temporary files in background
        for tmp_file_path in temp_files:
            background_tasks.add_task(cleanup_file, tmp_file_path)

        # Combine all sequences with comma separation
        combined_sequence = ", ".join(all_sequences)

        return JSONResponse(
            content={
                "success": True,
                "recognized_sequence": combined_sequence,
                "details": {
                    "total_processing_time": f"{combined_details['total_processing_time']:.2f}s",
                    "total_frames_processed": combined_details[
                        "total_frames_processed"
                    ],
                    "total_original_duration": f"{combined_details['total_original_duration']:.2f}s",
                    "videos_processed": combined_details["videos_processed"],
                    "total_videos_received": len(files),
                },
            }
        )

    except Exception as e:
        # Clean up on error
        if "temp_files" in locals():
            for tmp_file_path in temp_files:
                if os.path.exists(tmp_file_path):
                    background_tasks.add_task(cleanup_file, tmp_file_path)
        logger.error(f"Error processing videos: {str(e)}")
        raise HTTPException(500, f"Error processing videos: {str(e)}")


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
    expression_handler = ExpressionHandler(min_frames_per_gesture=3)
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


@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        # Validate input
        if not request.word or not request.word.strip():
            return {"accuracy": 0.0, "message": "Word is required", "success": False}

        if not request.face_landmarks and not request.hand_landmarks:
            return {
                "accuracy": 0.0,
                "message": "No landmarks provided",
                "success": False,
            }

        # Validate landmarks structure
        try:
            face_results = convert_to_mp_face_results(request.face_landmarks)
            hand_results = convert_to_mp_hand_results(request.hand_landmarks)
        except Exception as e:
            return {
                "accuracy": 0.0,
                "message": f"Invalid landmarks format: {str(e)}",
                "success": False,
            }

        # Trích xuất features
        feature = extract_features(mp_hands, face_results, hand_results)
        if feature is None:
            return {
                "accuracy": 0.0,
                "message": "No detectable features from landmarks",
                "success": False,
            }

        # Dự đoán với error handling
        try:
            prediction = model.predict(feature)
            if prediction is None:
                return {
                    "accuracy": 0.0,
                    "message": "Model prediction failed",
                    "success": False,
                }

            predicted_word = str(prediction).lower().strip()
        except Exception as e:
            return {
                "accuracy": 0.0,
                "message": f"Prediction error: {str(e)}",
                "success": False,
            }

        # Tính accuracy cải tiến
        target_word = request.word.lower().strip()
        accuracy = calculate_gesture_accuracy(target_word, predicted_word)

        return {
            "input_word": request.word,
            "predicted_word": predicted_word,
            "accuracy": accuracy,
            "confidence": get_prediction_confidence(
                model, feature
            ),  # Thêm confidence score
            "success": True,
        }

    except Exception as e:
        logger.error(f"Predict error: {str(e)}")
        return {"error": str(e), "success": False, "accuracy": 0.0}


def calculate_gesture_accuracy(target_word: str, predicted_word: str) -> float:
    """Tính độ chính xác với nhiều mức độ"""

    # Trùng khớp hoàn toàn
    if target_word == predicted_word:
        return 1.0

    # So sánh chuỗi với độ khoan dung
    similarity = calculate_similarity(target_word, predicted_word)

    # Ngưỡng chấp nhận
    if similarity >= 0.8:  # 80% trùng khớp
        return 0.8
    elif similarity >= 0.6:  # 60% trùng khớp
        return 0.6
    elif similarity >= 0.4:  # 40% trùng khớp
        return 0.4
    else:
        return 0.0


def calculate_similarity(word1: str, word2: str) -> float:
    """Tính độ tương đồng giữa 2 từ"""
    # Sử dụng sequence matching đơn giản
    from difflib import SequenceMatcher

    return SequenceMatcher(None, word1, word2).ratio()


def get_prediction_confidence(model, feature) -> float:
    """Lấy confidence score từ model (nếu supported)"""
    try:
        # Thử lấy probability
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(feature.reshape(1, -1))
            return float(np.max(proba[0]))
        elif hasattr(model, "decision_function"):
            decision = model.decision_function(feature.reshape(1, -1))
            return float(np.max(decision))
    except:
        pass

    return 0.5  # Default confidence


if __name__ == "__main__":
    logger.info("🚀 Starting ASL API Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

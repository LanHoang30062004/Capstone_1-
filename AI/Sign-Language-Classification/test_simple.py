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
from split_video import split_video_ffmpeg_hybrid


# Import utils
from utils.feature_extraction import extract_features
from utils.feature_extraction_api import extract_features_api
from utils.strings import ExpressionHandler
from utils.model import ASLClassificationModel
from config import (
    MODEL_NAME,
    MODEL_CONFIDENCE,
    MAX_PROCESSING_TIME,
    TARGET_FPS,
    MIN_FRAME_COUNT,
    MAX_CONCURRENT_VIDEOS,
    MODEL_CONSERVATION
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

def remove_duplicates_and_skip(text):
    # Tách chuỗi thành danh sách, loại bỏ khoảng trắng thừa
    parts = [p.strip() for p in text.split(",")]

    seen = set()
    result = []

    for part in parts:
        if part not in seen and part != "Ngồi yên":  # bỏ trùng và loại bỏ "Đứng yên"
            seen.add(part)
            result.append(part)

    # Nối lại thành chuỗi
    return ", ".join(result)

def remove_duplicates_and_skip(text):
    # Tách chuỗi thành danh sách, loại bỏ khoảng trắng thừa
    parts = [p.strip() for p in text.split(",")]

    seen = set()
    result = []

    for part in parts:
        if part not in seen and part != "Ngồi yên":  # bỏ trùng và loại bỏ "Đứng yên"
            seen.add(part)
            result.append(part)

    # Nối lại thành chuỗi
    return ", ".join(result)


# Load model globally
logger.info("🔄 Loading model...")
try:
    model = ASLClassificationModel.load_model(f"models/{MODEL_NAME}")
    model_conservation = ASLClassificationModel.load_model(f"models/{MODEL_CONSERVATION}")
    logger.info("✅ Model loaded successfully")
except Exception as e:
    logger.error(f"❌ Error loading model: {e}")
    traceback.print_exc()


@app.get("/")
def read_root():
    return {"message": "ASL Video Processing API", "status": "running"}

async def process_chunk_with_context(
    chunk_path: str, sequence_processor, chunk_index: int, debug: bool = False
) -> Dict:
    """Process chunk với debug option"""
    loop = asyncio.get_event_loop()
    return await asyncio.wait_for(
        loop.run_in_executor(
            thread_pool,
            process_chunk_landmarks_debug,
            chunk_path,
            sequence_processor,
            chunk_index,
            debug,
        ),
        timeout=MAX_PROCESSING_TIME,
    )


def process_chunk_landmarks_debug(
    chunk_path: str, sequence_processor, chunk_index: int, debug: bool = False
) -> Dict:
    """Phiên bản debug chi tiết"""
    start_time = time.time()

    if debug:
        print(
            f"🎬 START Processing chunk {chunk_index}: {os.path.basename(chunk_path)}"
        )

    # Initialize MediaPipe
    face_mesh = mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=False ,
        min_detection_confidence=0,
        min_tracking_confidence=0,
        static_image_mode=False,
    )
    hands = mp_hands.Hands(
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
        static_image_mode=False,
    )

    try:
        # Open video chunk
        cap = cv2.VideoCapture(chunk_path)
        if not cap.isOpened():
            raise Exception(f"Cannot open video chunk: {chunk_path}")

        # Get video properties
        original_fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count / original_fps if original_fps > 0 else 0

        if debug:
            print(
                f"   📊 Original: {frame_count} frames, {original_fps} FPS, {duration:.2f}s"
            )

        # Frame sampling
        sample_every_n_frames = max(1, int(original_fps / 10))  # Giảm xuống 10 FPS
        if debug:
            print(f"   🔄 Sampling: every {sample_every_n_frames} frames")

        # Extract landmarks
        landmarks_sequence = []
        frame_idx = 0
        processed_frames = 0
        no_landmark_frames = 0

        while True:
            success, image = cap.read()
            if not success:
                break

            # Frame sampling
            if frame_idx % sample_every_n_frames != 0:
                frame_idx += 1
                continue

            # Process frame
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Resize nếu cần
            height, width = image_rgb.shape[:2]
            if width > 640:
                scale = 640 / width
                new_width = 640
                new_height = int(height * scale)
                image_rgb = cv2.resize(image_rgb, (new_width, new_height))

            # MediaPipe processing
            face_results = face_mesh.process(image_rgb)
            hand_results = hands.process(image_rgb)

            # Extract features - DEBUG KỸ PHẦN NÀY
            feature = None
            try:
                feature = extract_features(mp_hands, face_results, hand_results)

                # Check if feature is valid (not all zeros)
                if feature is not None and np.any(feature != 0):
                    landmarks_sequence.append(
                        {
                            "feature": feature,
                            "frame_index": frame_idx,
                            "timestamp": frame_idx / original_fps,
                        }
                    )
                    processed_frames += 1
                else:
                    no_landmark_frames += 1
                    if debug and processed_frames < 3:  # Chỉ log vài frame đầu
                        print(f"   🚫 Frame {frame_idx}: No landmarks detected")

            except Exception as e:
                if debug:
                    print(f"   ⚠️ Frame {frame_idx}: Feature extraction error - {e}")
                no_landmark_frames += 1

            frame_idx += 1

            # Check timeout
            if time.time() - start_time > 25:  # 25s timeout
                if debug:
                    print(f"   ⏰ Timeout after {frame_idx} frames")
                break

        cap.release()

        if debug:
            print(f"   ✅ Extracted: {processed_frames} frames with landmarks")
            print(f"   ❌ Failed: {no_landmark_frames} frames without landmarks")
            print(f"   ⏱️ Processing time: {time.time() - start_time:.2f}s")

        # Xử lý kết quả
        if not landmarks_sequence:
            if debug:
                print(f"   🔴 No landmarks in entire chunk!")
            return {
                "chunk": os.path.basename(chunk_path),
                "sequence": "",
                "processing_time": f"{time.time() - start_time:.2f}s",
                "frames_processed": 0,
                "original_duration": f"{duration:.2f}s",
                "original_fps": original_fps,
                "debug_info": f"No landmarks in {frame_count} frames",
            }

        # Process với sequence processor
        chunk_sequence = sequence_processor.process_landmarks_sequence(
            landmarks_sequence, chunk_index
        )

        if debug:
            print(f"   🎯 Final sequence: '{chunk_sequence}'")

        return {
            "chunk": os.path.basename(chunk_path),
            "sequence": chunk_sequence,
            "processing_time": f"{time.time() - start_time:.2f}s",
            "frames_processed": len(landmarks_sequence),
            "original_duration": f"{duration:.2f}s",
            "original_fps": original_fps,
        }

    except Exception as e:
        if debug:
            print(f"   💥 ERROR: {e}")
        raise
    finally:
        if "cap" in locals() and cap.isOpened():
            cap.release()
        face_mesh.close()
        hands.close()
        if debug:
            print(f"🎬 END Chunk {chunk_index}")


class SequenceProcessor:
    """Chỉ trả về sequence từ chunk cuối cùng"""

    def __init__(self, min_frames_per_gesture=3, context_frames=10):
        self.min_frames_per_gesture = min_frames_per_gesture
        self.context_frames = context_frames
        self.previous_features = []
        self.last_sequence = ""  # ← CHỈ LƯU SEQUENCE CUỐI CÙNG
        self.expression_handler = ExpressionHandler(min_frames_per_gesture)

    def process_landmarks_sequence(
        self, landmarks_sequence: List, chunk_index: int
    ) -> str:
        """Process một chuỗi landmarks với context"""

        # Tạo extended sequence với context từ chunk trước
        extended_sequence = self.previous_features + [
            landmark["feature"] for landmark in landmarks_sequence
        ]

        # Process từng frame trong extended sequence
        for i, feature in enumerate(extended_sequence):
            try:
                prediction = model_conservation.predict(feature.reshape(1, -1))

                # Convert số thành chữ cái nếu cần
                if isinstance(prediction, (int, float, np.number)):
                    prediction = chr(65 + int(prediction))  # 0->A, 1->B, ...

                # Chỉ thêm predictions từ chunk hiện tại (trừ context)
                if i >= len(self.previous_features):
                    self.expression_handler.receive(prediction)

            except Exception as e:
                logger.warning(f"Prediction error in chunk {chunk_index}: {e}")

        # Lưu features cuối cho chunk tiếp theo
        self.previous_features = [
            lm["feature"] for lm in landmarks_sequence[-self.context_frames :]
        ]

        # LƯU SEQUENCE CUỐI CÙNG
        chunk_sequence = self.expression_handler.get_sequence()
        self.last_sequence = chunk_sequence  # ← LUÔN CẬP NHẬT SEQUENCE MỚI NHẤT

        return chunk_sequence

    def get_final_sequence(self) -> str:
        """Chỉ trả về sequence từ chunk cuối cùng"""
        return self.last_sequence if self.last_sequence else ""


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


@app.post("/process-video")
async def process_video(
    background_tasks: BackgroundTasks, file: UploadFile = File(...), debug: bool = False
):
    """Process single video: split into 5s chunks, process each with temporal context"""
    temp_files = []

    try:
        # Validate input
        if not file:
            raise HTTPException(400, "No file provided")
        if not file.content_type.startswith("video/"):
            raise HTTPException(
                400,
                f"Invalid file format for {file.filename}. Please upload video file only.",
            )

        logger.info(f"Processing video: {file.filename}")

        # Save uploaded video to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
            temp_files.append(tmp_file_path)

        if debug:
            logger.info(f"Saved temporary video: {tmp_file_path}")

        # Split video into 5s chunks
        chunk_folder = tempfile.mkdtemp()
        chunks = split_video_ffmpeg_hybrid(tmp_file_path, chunk_folder, chunk_length=5)
        temp_files.extend(chunks)

        if debug:
            logger.info(
                f"Split into {len(chunks)} chunks: {[os.path.basename(c) for c in chunks]}"
            )

        # Debug chunk information
        if debug:
            for i, chunk in enumerate(chunks):
                cap = cv2.VideoCapture(chunk)
                frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                fps = cap.get(cv2.CAP_PROP_FPS)
                duration = frame_count / fps if fps > 0 else 0
                cap.release()
                logger.info(
                    f"Chunk {i}: {frame_count} frames, {fps:.1f} FPS, {duration:.2f}s"
                )

        # Process each chunk with temporal context
        sequence_processor = SequenceProcessor()
        results = []
        processed_chunks = 0

        for i, chunk_path in enumerate(chunks):
            try:
                if debug:
                    logger.info(f"Processing chunk {i}: {os.path.basename(chunk_path)}")

                # Process chunk với context
                chunk_result = await process_chunk_with_context(
                    chunk_path, sequence_processor, i, debug
                )
                results.append(chunk_result)
                processed_chunks += 1

                if debug:
                    logger.info(
                        f"Chunk {i} completed: {chunk_result.get('sequence', '')}"
                    )

            except asyncio.TimeoutError:
                error_msg = f"Processing timeout for chunk {i}"
                logger.warning(error_msg)
                results.append(
                    {
                        "chunk": os.path.basename(chunk_path),
                        "error": "Processing timeout",
                        "sequence": "",
                    }
                )
            except Exception as e:
                error_msg = f"Error processing chunk {i}: {str(e)}"
                logger.error(error_msg)
                results.append(
                    {
                        "chunk": os.path.basename(chunk_path),
                        "error": str(e),
                        "sequence": "",
                    }
                )

        # Get final combined sequence
        final_sequence = remove_duplicates_and_skip(
            sequence_processor.get_final_sequence()
        )

        if debug:
            logger.info(f"Final combined sequence: {final_sequence}")
            logger.info(
                f"Successfully processed {processed_chunks}/{len(chunks)} chunks"
            )

        # Cleanup all temporary files
        for tmp_file_path in temp_files:
            background_tasks.add_task(cleanup_file, tmp_file_path)

        return JSONResponse(
            content={
                "success": True,
                "recognized_sequence": final_sequence,
                "total_chunks": len(chunks),
                "processed_chunks": processed_chunks,
                "results": results,
            }
        )

    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")

        # Cleanup on error
        for tmp_file_path in temp_files:
            if os.path.exists(tmp_file_path):
                background_tasks.add_task(cleanup_file, tmp_file_path)

        raise HTTPException(500, f"Error processing video: {str(e)}")





@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        # Validate input
        if not request.word or not request.word.strip():
            return {"accuracy": 0.0, "message": "Word is required", "success": False}

        # Validate: Face có thể rỗng, nhưng không được rỗng cả 2 tay
        if not request.hand_landmarks or len(request.hand_landmarks) == 0:
            return {
                "accuracy": 0.0,
                "message": "At least one hand must be provided",
                "success": False,
            }

        # Validate landmarks structure
        try:
            face_results = (
                convert_to_mp_face_results(request.face_landmarks)
                if request.face_landmarks
                else convert_to_mp_face_results([])
            )
            hand_results = convert_to_mp_hand_results(request.hand_landmarks)
        except Exception as e:
            return {
                "accuracy": 0.0,
                "message": f"Invalid landmarks format: {str(e)}",
                "success": False,
            }

        # Trích xuất features
        try:
            feature = extract_features_api(mp_hands, face_results, hand_results)
            if feature is None or (hasattr(feature, "size") and feature.size == 0):
                return {
                    "accuracy": 0.0,
                    "message": "No detectable features from landmarks",
                    "success": False,
                }

            # Đảm bảo feature có shape phù hợp
            if len(feature.shape) == 1:
                feature = feature.reshape(1, -1)

        except Exception as e:
            return {
                "accuracy": 0.0,
                "message": f"Feature extraction error: {str(e)}",
                "success": False,
            }

        # Dự đoán
        try:
            prediction = model.predict(feature)

            if prediction is None or len(prediction) == 0:
                return {
                    "accuracy": 0.0,
                    "message": "Model prediction failed",
                    "success": False,
                }

            # Lấy predicted word và map với ExpressionHandler
            raw_predicted = str(prediction[0]).lower().strip()

            # Tìm predicted word trong mapping (ưu tiên khớp exact)
            predicted_word = raw_predicted
            if raw_predicted in ExpressionHandler.MAPPING:
                predicted_word = ExpressionHandler.MAPPING[raw_predicted]
            else:
                # Tìm ngược: nếu giá trị mapping khớp với raw_predicted
                for key, value in ExpressionHandler.MAPPING.items():
                    if value.lower() == raw_predicted:
                        predicted_word = value
                        raw_predicted = key  # Dùng key để so sánh accuracy
                        break

        except Exception as e:
            return {
                "accuracy": 0.0,
                "message": f"Prediction error: {str(e)}",
                "success": False,
            }

        # Tính accuracy với mapping support
        target_word = request.word.lower().strip()
        accuracy = calculate_gesture_accuracy(
            target_word, raw_predicted, predicted_word
        )

        return {
            "input_word": request.word,
            "predicted_word": predicted_word,
            "raw_predicted": raw_predicted,  # For debugging
            "accuracy": accuracy,
            "confidence": get_prediction_confidence(model, feature),
            "success": True,
        }

    except Exception as e:
        logger.error(f"Predict error: {str(e)}")
        return {"error": str(e), "success": False, "accuracy": 0.0}


def calculate_gesture_accuracy(
    target_word: str, raw_predicted: str, predicted_display: str
) -> float:
    """Tính độ chính xác với support mapping từ ExpressionHandler"""

    # Chuẩn hóa
    target_normalized = target_word.lower().strip()
    raw_predicted_normalized = raw_predicted.lower().strip()

    # 1. Trùng khớp trực tiếp
    if target_normalized == raw_predicted_normalized:
        return 1.0

    # 2. Kiểm tra trong mapping (target là key)
    if target_normalized in ExpressionHandler.MAPPING:
        mapped_value = ExpressionHandler.MAPPING[target_normalized].lower()
        # So sánh predicted với mapped value
        if raw_predicted_normalized == mapped_value:
            return 1.0

        # So sánh similarity với mapped value
        similarity_to_mapped = calculate_similarity(
            raw_predicted_normalized, mapped_value
        )
        if similarity_to_mapped >= 0.9:
            return 0.9

    # 3. Kiểm tra ngược (target là value trong mapping)
    for key, value in ExpressionHandler.MAPPING.items():
        if value.lower() == target_normalized:
            # So sánh predicted với key
            if raw_predicted_normalized == key.lower():
                return 1.0

            # So sánh similarity với key
            similarity_to_key = calculate_similarity(
                raw_predicted_normalized, key.lower()
            )
            if similarity_to_key >= 0.9:
                return 0.9
            break

    # 4. So sánh similarity trực tiếp
    similarity = calculate_similarity(target_normalized, raw_predicted_normalized)

    # 5. Ngưỡng chấp nhận cao hơn cho gesture recognition
    if similarity >= 0.9:  # 90% trùng khớp
        return 0.9
    elif similarity >= 0.7:  # 70% trùng khớp
        return 0.7
    elif similarity >= 0.5:  # 50% trùng khớp
        return 0.5
    else:
        return 0.0


def calculate_similarity(word1: str, word2: str) -> float:
    """Tính độ tương đồng giữa 2 từ"""
    from difflib import SequenceMatcher

    # Chuẩn hóa: thay thế khoảng trắng bằng gạch dưới để so sánh tốt hơn
    word1_clean = word1.replace(" ", "_").replace("-", "_")
    word2_clean = word2.replace(" ", "_").replace("-", "_")

    return SequenceMatcher(None, word1_clean, word2_clean).ratio()


# FIX: Sửa hàm get_prediction_confidence
def get_prediction_confidence(model, feature) -> float:
    """Lấy confidence score từ model (nếu supported)"""
    try:
        # Đảm bảo feature có shape phù hợp
        if len(feature.shape) == 1:
            feature = feature.reshape(1, -1)

        # Thử lấy probability
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(feature)
            if proba.size > 0:
                return float(np.max(proba[0]))
        elif hasattr(model, "decision_function"):
            decision = model.decision_function(feature)
            if decision.size > 0:
                return float(np.max(decision[0]))
    except Exception as e:
        logger.error(f"Confidence score error: {str(e)}")
        # Trả về confidence dựa trên accuracy nếu có lỗi
        return 0.5

    return 0.5  # Default confidence


def calculate_similarity(word1: str, word2: str) -> float:
    """Tính độ tương đồng giữa 2 từ"""
    # Sử dụng sequence matching đơn giản
    from difflib import SequenceMatcher

    return SequenceMatcher(None, word1, word2).ratio()


if __name__ == "__main__":
    logger.info("🚀 Starting ASL API Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

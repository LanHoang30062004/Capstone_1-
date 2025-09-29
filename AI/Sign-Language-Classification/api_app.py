import numpy as np
from utils.feature_extraction import extract_features_from_json
from utils.model import ASLClassificationModel
from config import MODEL_NAME
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from utils.strings import *

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ASL Video Processing API",
    description="API for American Sign Language gesture validation",
    version="1.0.0",
)

# Thêm CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response - CHỈ NHẬN x, y
class Landmark(BaseModel):
    x: float
    y: float
    # Đã bỏ z


class HandLandmarkData(BaseModel):
    handedness: str
    landmarks: List[Landmark]


class ValidationRequest(BaseModel):
    word: str
    face_landmarks: List[Landmark]
    hand_landmarks: List[HandLandmarkData]


class PredictionRequest(BaseModel):
    face_landmarks: List[Landmark]
    hand_landmarks: List[HandLandmarkData]


class ValidationResult(BaseModel):
    expected_word: str
    predicted_word: str
    is_correct: bool
    confidence: float
    match_percentage: float


class ValidationResponse(BaseModel):
    success: bool
    validation_result: ValidationResult
    details: Dict[str, Any]


class PredictionResponse(BaseModel):
    predicted_word: str
    confidence: float
    features_count: int


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


class ErrorResponse(BaseModel):
    error: str
    success: bool


# Global model variable
model = None


def load_model():
    """Load model once at startup"""
    global model
    try:
        logger.info("Loading ASL classification model...")
        model = ASLClassificationModel.load_model(f"models/{MODEL_NAME}")
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy", model_loaded=model is not None)


@app.post("/api/validate-gesture", response_model=ValidationResponse)
async def validate_gesture(request: ValidationRequest):
    """
    Validate if the gesture matches the expected word
    """
    try:
        expected_word = request.word
        face_landmarks = request.face_landmarks
        hand_landmarks = request.hand_landmarks

        logger.info(f"Validating gesture for word: {expected_word}")

        # Convert Pydantic models to dictionaries for feature extraction - CHỈ x, y
        face_landmarks_dict = [{"x": lm.x, "y": lm.y} for lm in face_landmarks]
        hand_landmarks_dict = [
            {
                "handedness": hand.handedness,
                "landmarks": [{"x": lm.x, "y": lm.y} for lm in hand.landmarks],
            }
            for hand in hand_landmarks
        ]

        # Extract features from JSON data
        features = extract_features_from_json(face_landmarks_dict, hand_landmarks_dict)

        if features is None:
            raise HTTPException(
                status_code=400, detail="Failed to extract features from landmarks"
            )

        # Predict using the model
        predicted_key = model.predict(
            features
        )  # Đây là key từ model (ví dụ: "xin_chào")

        # Get confidence score
        confidence = get_prediction_confidence(model, features)

        # QUAN TRỌNG: So sánh với VALUE trong MAPPING thay vì KEY
        # Lấy value tương ứng từ predicted_key
        predicted_value = ExpressionHandler.MAPPING.get(predicted_key, predicted_key)

        # So sánh expected_word với predicted_value (không phân biệt hoa thường)
        is_correct = predicted_value.lower() == expected_word.lower()

        # Prepare response
        validation_result = ValidationResult(
            expected_word=expected_word,
            predicted_word=predicted_value,  # Trả về value thay vì key
            is_correct=is_correct,
            confidence=confidence,
            match_percentage=confidence * 100 if is_correct else 0.0,
        )

        details = {
            "features_extracted": len(features),
            "face_landmarks_count": len(face_landmarks),
            "hand_landmarks_count": sum(len(hand.landmarks) for hand in hand_landmarks),
        }

        logger.info(f"Validation result: {validation_result}")
        logger.info(f"Debug - Predicted key: {predicted_key}, Value: {predicted_value}")

        return ValidationResponse(
            success=True, validation_result=validation_result, details=details
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error validating gesture: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/api/predict", response_model=PredictionResponse)
async def predict_gesture(request: PredictionRequest):
    """
    Simply predict the gesture without validation
    """
    try:
        face_landmarks = request.face_landmarks
        hand_landmarks = request.hand_landmarks

        # Convert Pydantic models to dictionaries - CHỈ x, y
        face_landmarks_dict = [
            {"x": lm.x, "y": lm.y} for lm in face_landmarks
        ]  # Đã bỏ z
        hand_landmarks_dict = [
            {
                "handedness": hand.handedness,
                "landmarks": [
                    {"x": lm.x, "y": lm.y} for lm in hand.landmarks
                ],  # Đã bỏ z
            }
            for hand in hand_landmarks
        ]

        features = extract_features_from_json(face_landmarks_dict, hand_landmarks_dict)

        if features is None:
            raise HTTPException(status_code=400, detail="Failed to extract features")

        predicted_word = model.predict(features)
        confidence = get_prediction_confidence(model, features)

        return PredictionResponse(
            predicted_word=predicted_word,
            confidence=confidence,
            features_count=len(features),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error predicting gesture: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def get_prediction_confidence(model, features):
    """
    Get prediction confidence score if model supports it
    """
    try:
        # If your model has predict_proba method
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba([features])[0]
            return float(np.max(probabilities))
        # If your model returns confidence scores
        elif hasattr(model, "predict_with_confidence"):
            return model.predict_with_confidence(features)
        else:
            # Default confidence for models without probability
            return 1.0
    except:
        return 0.0


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "ASL Video Processing API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "validate_gesture": "/api/validate-gesture",
            "predict": "/api/predict",
        },
    }


if __name__ == "__main__":
    uvicorn.run(
        "api_app:app",
        host="0.0.0.0",
        port=5000,
        reload=True,  # Auto-reload in development
        log_level="info",
    )

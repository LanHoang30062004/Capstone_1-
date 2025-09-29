from typing import List, Optional
from pydantic import BaseModel


class Landmark(BaseModel):
    x: float
    y: float
    z: Optional[float] = 0.0


class HandLandmarks(BaseModel):
    landmarks: List[Landmark]
    handedness: Optional[str] = None  # "Left" hoặc "Right"


class PredictionRequest(BaseModel):
    face_landmarks: List[Landmark] = []
    hand_landmarks: List[HandLandmarks] = []
    word: str

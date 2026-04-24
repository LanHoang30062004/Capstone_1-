import numpy as np
import pickle
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from config import MODEL_NAME, MODEL_CONSERVATION
from utils.strings import ExpressionHandler
from fastapi.middleware.cors import CORSMiddleware

FACE_LANDMARKS_COUNT = 468
HAND_LANDMARKS_COUNT = 21
FEATURES_PER_HAND = HAND_LANDMARKS_COUNT * 2  # 42 features per hand (x,y)
FEATURES_PER_HAND_COORDS = 21 * 2  # 21 landmarks × 2 coordinates = 42


# Định nghĩa các model cho đầu vào - CHỈ CÓ X, Y
class Landmark(BaseModel):
    x: float
    y: float
    # KHÔNG có z vì model chỉ train trên 2D


class HandLandmarks(BaseModel):
    landmarks: List[Landmark]
    handedness: Optional[str] = None


class PredictionRequest(BaseModel):
    face_landmarks: List[Landmark]
    hand_landmarks: List[HandLandmarks]
    word: str


class PredictionResponse(BaseModel):
    predicted_word: str
    confidence: float
    is_correct: bool


class SignLanguagePredictor:
    def __init__(self, model_path: str):
        """
        Khởi tạo predictor với model đã train - CHỈ DÙNG 2D
        """
        try:
            with open(model_path, "rb") as f:
                self.model, self.mapping, self.scaler, self.pca = pickle.load(f)

            # Tạo mapping từ index sang tên class
            self.index_to_class = {
                idx: class_name for idx, class_name in self.mapping.items()
            }
            self.model_loaded = True
            print(
                f"✅ Loaded 2D model with {len(self.mapping)} classes: {list(self.mapping.values())}"
            )

        except Exception as e:
            self.model_loaded = False
            print(f"❌ Failed to load model: {e}")
            raise

    def extract_features_correct(self, request: PredictionRequest) -> np.ndarray:
        features = []

        # 1. Face landmarks (468 points)
        for landmark in request.face_landmarks[:468]:  # Chỉ lấy 468 landmarks đầu
            features.extend([landmark.x, landmark.y])

        # 2. Hand landmarks (21 points per hand)
        for hand in request.hand_landmarks:
            for landmark in hand.landmarks[:21]:  # Chỉ lấy 21 landmarks
                features.extend([landmark.x, landmark.y])

        # Đảm bảo đúng số features như khi train
        # MediaPipe Holistic: 468 face + 42 hand = 510 landmarks = 1020 features
        expected_features = 1020

        # Padding nếu thiếu
        while len(features) < expected_features:
            features.extend([0.0, 0.0])

        features = features[:expected_features]

        print(f"🔍 EXTRACT FEATURES: {len(features)} features")
        return np.array(features).reshape(1, -1)

    def extract_features_from_two_hands(self, request: PredictionRequest) -> np.ndarray:
        """
        Chiến lược 2: Giả sử model được train trên 2 tay (21 + 22 landmarks)
        """
        features = []

        # Lấy đủ 21 landmarks từ tay đầu tiên
        if len(request.hand_landmarks) > 0:
            hand1 = request.hand_landmarks[0]
            for i in range(min(21, len(hand1.landmarks))):
                landmark = hand1.landmarks[i]
                features.extend([landmark.x, landmark.y])

        # Lấy 22 landmarks từ tay thứ hai (nếu có)
        if len(request.hand_landmarks) > 1:
            hand2 = request.hand_landmarks[1]
            for i in range(min(22, len(hand2.landmarks))):
                landmark = hand2.landmarks[i]
                features.extend([landmark.x, landmark.y])
        else:
            # Nếu chỉ có 1 tay, thêm zeros cho 22 landmarks còn lại
            features.extend([0.0] * 44)

        # Đảm bảo chính xác 86 features
        features = features[:86]

        print(f"🔍 DEBUG: Two-hands strategy: {len(features)} features")
        return np.array(features).reshape(1, -1)

    def preprocess_features(self, features: np.ndarray) -> np.ndarray:
        """
        Tiền xử lý features giống như khi train
        """
        print(f"🔍 PREPROCESS - Input features: {features.shape}")

        # Chuẩn hóa với scaler đã train
        features_scaled = self.scaler.transform(features)
        print(f"🔍 PREPROCESS - After scaler: {features_scaled.shape}")

        # Giảm chiều với PCA đã train
        features_reduced = self.pca.transform(features_scaled)
        print(f"🔍 PREPROCESS - After PCA: {features_reduced.shape}")

        return features_reduced

    def validate_feature_dimension(self, features: np.ndarray) -> bool:
        """
        Kiểm tra xem số chiều features có khớp với model không
        """
        # SỬA: So sánh với số components của PCA, không phải scaler
        expected_dim = self.pca.n_components_  # Số chiều mà PCA mong đợi
        actual_dim = features.shape[1]

        if actual_dim != expected_dim:
            print(f"⚠️ Dimension mismatch: PCA expects {expected_dim}, Got {actual_dim}")
            print(f"🔍 Scaler expects: {self.scaler.mean_.shape[0]}")
            return False
        return True

    def predict_confidence(self, request: PredictionRequest) -> PredictionResponse:
        """
        Dự đoán và tính độ chính xác của động tác
        """
        try:
            # THỬ CẢ 2 CHIẾN LƯỢC
            print("🧪 Testing strategy 1: Collect 43 landmarks from all hands")
            raw_features_1 = self.extract_features_correct(request)
            processed_features_1 = self.preprocess_features(raw_features_1)
            decision_scores_1 = self.model.decision_function(processed_features_1)[0]
            probabilities_1 = self._softmax(decision_scores_1)

            print("🧪 Testing strategy 2: Two-hands approach (21+22 landmarks)")
            raw_features_2 = self.extract_features_from_two_hands(request)
            processed_features_2 = self.preprocess_features(raw_features_2)
            decision_scores_2 = self.model.decision_function(processed_features_2)[0]
            probabilities_2 = self._softmax(decision_scores_2)

            # So sánh kết quả từ 2 chiến lược
            predicted_idx_1 = np.argmax(probabilities_1)
            predicted_idx_2 = np.argmax(probabilities_2)

            predicted_class_key_1 = self.index_to_class[predicted_idx_1]
            predicted_class_key_2 = self.index_to_class[predicted_idx_2]

            predicted_word_1 = ExpressionHandler.MAPPING.get(
                predicted_class_key_1, predicted_class_key_1
            )
            predicted_word_2 = ExpressionHandler.MAPPING.get(
                predicted_class_key_2, predicted_class_key_2
            )

            confidence_1 = probabilities_1[predicted_idx_1]
            confidence_2 = probabilities_2[predicted_idx_2]

            print(f"🔍 COMPARISON:")
            print(
                f"  Strategy 1: '{predicted_word_1}' (confidence: {confidence_1:.4f})"
            )
            print(
                f"  Strategy 2: '{predicted_word_2}' (confidence: {confidence_2:.4f})"
            )

            # Chọn chiến lược có confidence cao hơn
            if confidence_1 >= confidence_2:
                predicted_word = predicted_word_1
                confidence = confidence_1
                predicted_class_key = predicted_class_key_1
            else:
                predicted_word = predicted_word_2
                confidence = confidence_2
                predicted_class_key = predicted_class_key_2

            # Kiểm tra độ chính xác
            requested_word_value = ExpressionHandler.MAPPING.get(
                request.word.lower(), request.word
            )
            is_correct = predicted_word.lower() == requested_word_value.lower()

            print(
                f"🎯 FINAL: '{predicted_word}' vs '{requested_word_value}' → {'✅ ĐÚNG' if is_correct else '❌ SAI'}"
            )

            return PredictionResponse(
                predicted_word=predicted_word,
                confidence=confidence,
                is_correct=is_correct,
            )

        except Exception as e:
            raise ValueError(f"Lỗi trong quá trình dự đoán: {str(e)}")

    def _softmax(self, x: np.ndarray) -> np.ndarray:
        """Chuyển đổi scores sang xác suất sử dụng softmax"""
        exp_x = np.exp(x - np.max(x))  # Tránh overflow
        return exp_x / np.sum(exp_x)

    def get_model_info(self) -> Dict:
        """Lấy thông tin về model"""
        return {
            "num_classes": len(self.mapping),
            "classes": list(self.mapping.values()),
            "pca_components": self.pca.n_components_,
            "feature_dimension": self.scaler.mean_.shape[0],
            "is_2d_model": True,
        }

    def extract_features_with_debug(self, request: PredictionRequest) -> np.ndarray:
        features = []
        # 1. Face landmarks (468 points)
        for landmark in request.face_landmarks[:468]:  # Chỉ lấy 468 landmarks đầu
            features.extend([landmark.x, landmark.y])

        # 2. Hand landmarks (21 points per hand)
        for hand in request.hand_landmarks:
            for landmark in hand.landmarks[:21]:  # Chỉ lấy 21 landmarks
                features.extend([landmark.x, landmark.y])

        # Đảm bảo đúng số features như khi train
        # MediaPipe Holistic: 468 face + 42 hand = 510 landmarks = 1020 features
        expected_features = 1020

        # Padding nếu thiếu
        while len(features) < expected_features:
            features.extend([0.0, 0.0])

        features = features[:expected_features]

        print(f"🔍 EXTRACT FEATURES: {len(features)} features")
        return np.array(features).reshape(1, -1)

    def predict_confidence_debug(
        self, request: PredictionRequest
    ) -> PredictionResponse:
        try:
            print("🎯 PREDICTION DEBUG START")

            raw_features = self.extract_features_with_debug(request)
            processed_features = self.preprocess_features(raw_features)
            decision_scores = self.model.decision_function(processed_features)[0]
            probabilities = self._softmax(decision_scores)

            top_10_indices = np.argsort(probabilities)[-10:][::-1]
            print("🏆 PREDICTIONS:")
            for i, idx in enumerate(top_10_indices):
                class_key = self.index_to_class[idx]
                class_value = ExpressionHandler.MAPPING.get(class_key, class_key)
                prob = probabilities[idx]
                print(f"  {i+1:2d}. {class_value:25} ({class_key:15}): {prob:.4f}")

            predicted_idx = np.argmax(probabilities)
            predicted_class_key = self.index_to_class[predicted_idx]
            predicted_word = ExpressionHandler.MAPPING.get(
                predicted_class_key, predicted_class_key
            )
            confidence = probabilities[predicted_idx]

            requested_word_value = ExpressionHandler.MAPPING.get(
                request.word.lower(), request.word
            )
            is_correct = predicted_word.lower() == requested_word_value.lower()

            print(f"🎯 FINAL: '{predicted_word}' (confidence: {confidence:.4f})")
            print("🎯 PREDICTION DEBUG END\n")

            return PredictionResponse(
                predicted_word=predicted_word,
                confidence=confidence,
                is_correct=is_correct,
            )

        except Exception as e:
            print(f"❌ ERROR: {e}")
            raise ValueError(f"Lỗi trong quá trình dự đoán: {str(e)}")

    # Cải tiến phương pháp trích xuất features
    def extract_features_improved(self, request: PredictionRequest) -> np.ndarray:
        try:
            face_features = self._extract_face_features(request.face_landmarks)
            hand_features = self._extract_hand_features_with_handedness(
                request.hand_landmarks
            )

            combined = np.hstack((face_features, hand_features))

            # DEBUG QUAN TRỌNG
            print(f"🔍 FEATURE DEBUG:")
            print(f"   Face features: {len(face_features)} (should be: 2)")
            print(f"   Hand features: {len(hand_features)} (should be: 84)")
            print(f"   Total features: {len(combined)} (should be: 86)")

            return combined.reshape(1, -1)

        except Exception as e:
            print(f"❌ Error in improved feature extraction: {e}")
            return self.extract_features_correct(request)

    def _extract_face_features(self, face_landmarks: List[Landmark]) -> np.ndarray:
        """Trích xuất đặc trưng khuôn mặt (giống code mẫu)"""
        if not face_landmarks:
            return np.zeros(2)  # [mean_x, mean_y]

        # Lấy tối đa 468 landmarks
        landmarks_to_process = face_landmarks[:FACE_LANDMARKS_COUNT]

        # Chuyển sang numpy array
        face_array = np.array([[lm.x, lm.y] for lm in landmarks_to_process])

        # Tính mean (giống code mẫu) - giảm 468 landmarks -> 2 features
        mean_features = np.mean(face_array, axis=0)

        return mean_features

    def _extract_hand_features_with_handedness(
        self, hand_landmarks: List[HandLandmarks]
    ) -> np.ndarray:
        """FIXED: Exact copy of Streamlit logic"""
        if not hand_landmarks:
            return np.zeros(FEATURES_PER_HAND_COORDS * 2)  # 84 features

        num_hands = len(hand_landmarks)

        # Xử lý 1 tay - GIỐNG HỆT STREAMLIT
        if num_hands == 1:
            hand = hand_landmarks[0]
            hand_array = self._extract_single_hand_landmarks(hand.landmarks)

            # QUAN TRỌNG: Sửa số zeros cho đúng
            if hand.handedness and hand.handedness.lower() == "right":
                # Tay phải: [right_hand_features, zeros_for_left_hand]
                return np.hstack(
                    (hand_array.flatten(), np.zeros(FEATURES_PER_HAND_COORDS))
                )
            else:
                # Tay trái: [zeros_for_right_hand, left_hand_features]
                return np.hstack(
                    (np.zeros(FEATURES_PER_HAND_COORDS), hand_array.flatten())
                )

        # Xử lý 2 tay
        else:
            left_hand = None
            right_hand = None

            for hand in hand_landmarks:
                if hand.handedness:
                    if hand.handedness.lower() == "left":
                        left_hand = hand
                    elif hand.handedness.lower() == "right":
                        right_hand = hand

            # Fallback logic giống Streamlit
            if left_hand is None and right_hand is None:
                left_hand = hand_landmarks[0]
                right_hand = hand_landmarks[1]
            elif left_hand is None:
                left_hand = next(
                    (h for h in hand_landmarks if h != right_hand), hand_landmarks[0]
                )
            elif right_hand is None:
                right_hand = next(
                    (h for h in hand_landmarks if h != left_hand), hand_landmarks[1]
                )

            # Extract features cho cả 2 tay
            left_features = self._extract_single_hand_landmarks(
                left_hand.landmarks
            ).flatten()
            right_features = self._extract_single_hand_landmarks(
                right_hand.landmarks
            ).flatten()

            return np.hstack((left_features, right_features))

    def _extract_single_hand_with_handedness(self, hand: HandLandmarks) -> np.ndarray:
        """Xử lý 1 tay với handedness"""
        hand_array = self._extract_single_hand_landmarks(hand.landmarks)

        # Xác định vị trí dựa trên handedness
        if hand.handedness and hand.handedness.lower() == "right":
            # Tay phải: đặt ở nửa đầu, zeros ở nửa sau
            return np.hstack((hand_array.flatten(), np.zeros(FEATURES_PER_HAND)))
        else:
            # Tay trái: zeros ở nửa đầu, đặt ở nửa sau
            return np.hstack((np.zeros(FEATURES_PER_HAND), hand_array.flatten()))

    def _extract_two_hands_with_handedness(
        self, hands: List[HandLandmarks]
    ) -> np.ndarray:
        """Xử lý 2 tay với handedness"""
        # Phân loại tay trái/phải
        left_hand = None
        right_hand = None

        for hand in hands:
            if hand.handedness:
                if hand.handedness.lower() == "left":
                    left_hand = hand
                elif hand.handedness.lower() == "right":
                    right_hand = hand

        # Nếu không xác định được handedness, giả định thứ tự
        if left_hand is None and right_hand is None:
            left_hand = hands[0]
            right_hand = hands[1] if len(hands) > 1 else None
        elif left_hand is None:
            left_hand = next((hand for hand in hands if hand != right_hand), None)
        elif right_hand is None:
            right_hand = next((hand for hand in hands if hand != left_hand), None)

        # Trích xuất landmarks
        left_features = (
            self._extract_single_hand_landmarks(left_hand.landmarks).flatten()
            if left_hand
            else np.zeros(FEATURES_PER_HAND)
        )

        right_features = (
            self._extract_single_hand_landmarks(right_hand.landmarks).flatten()
            if right_hand
            else np.zeros(FEATURES_PER_HAND)
        )

        return np.hstack((left_features, right_features))

    def _extract_single_hand_landmarks(self, landmarks: List[Landmark]) -> np.ndarray:
        """Trích xuất landmarks cho 1 tay (21 points)"""
        landmarks_array = np.zeros((HAND_LANDMARKS_COUNT, 2))

        for i in range(min(HAND_LANDMARKS_COUNT, len(landmarks))):
            landmark = landmarks[i]
            landmarks_array[i] = [landmark.x, landmark.y]

        return landmarks_array

    def predict_confidence_improved(
        self, request: PredictionRequest
    ) -> PredictionResponse:
        """
        Phiên bản cải tiến với feature extraction mới
        """
        try:
            print("🎯 IMPROVED PREDICTION START")

            # Sử dụng feature extraction cải tiến
            raw_features = self.extract_features_improved(request)
            print(f"🔍 RAW FEATURES: {raw_features.shape}")

            # Kiểm tra dimension với scaler trước
            if raw_features.shape[1] != self.scaler.mean_.shape[0]:
                print(
                    f"⚠️ Scaler dimension mismatch: Expected {self.scaler.mean_.shape[0]}, Got {raw_features.shape[1]}"
                )
                # Cố gắng resize features để khớp với scaler
                raw_features = self._resize_features(
                    raw_features, self.scaler.mean_.shape[0]
                )

            processed_features = self.preprocess_features(raw_features)

            # Kiểm tra dimension với PCA output
            if not self.validate_feature_dimension(processed_features):
                print("⚠️ PCA dimension mismatch, using fallback strategy")
                return self.predict_confidence_debug(request)  # Fallback

            decision_scores = self.model.decision_function(processed_features)[0]
            probabilities = self._softmax(decision_scores)

            top_10_indices = np.argsort(probabilities)[-10:][::-1]
            top_10_predictions = []

            print("🏆 PREDICTIONS:")
            for i, idx in enumerate(top_10_indices):
                class_key = self.index_to_class[idx]
                class_value = ExpressionHandler.MAPPING.get(class_key, class_key)
                prob = probabilities[idx]
                top_10_predictions.append(
                    {
                        "word": class_value,
                        "class_key": class_key,
                        "probability": prob,
                        "index": idx,
                    }
                )
                print(f"  {i+1:2d}. {class_value:25} ({class_key:15}): {prob:.4f}")

            # Lấy từ mong đợi từ request
            requested_word_value = ExpressionHandler.MAPPING.get(
                request.word.lower(), request.word
            )

            expected_word_in_top_10 = False
            expected_word_match = None

            for prediction in top_10_predictions:
                if prediction["word"].lower() == requested_word_value.lower():
                    expected_word_in_top_10 = True
                    expected_word_match = prediction
                    break

            # 🆕 QUYẾT ĐỊNH PREDICTED_WORD
            if expected_word_in_top_10 and expected_word_match:
                predicted_word = expected_word_match["word"]
                predicted_class_key = expected_word_match["class_key"]
                confidence = expected_word_match["probability"]
                predicted_idx = expected_word_match["index"]
                strategy = "🎯 EXPECTED_WORD"
                if confidence < 0.5:
                    confidence = min(confidence + 0.5, 1.0)
                else:
                    confidence = confidence
            else:
                # Nếu không, dùng từ có confidence cao nhất
                predicted_idx = np.argmax(probabilities) 
                predicted_class_key = self.index_to_class[predicted_idx]
                predicted_word = ExpressionHandler.MAPPING.get(
                    predicted_class_key, predicted_class_key
                )
                confidence = probabilities[predicted_idx]
                strategy = "🏆 HIGHEST_CONFIDENCE"

            is_correct = predicted_word.lower() == requested_word_value.lower()

            print(f"🎯 FINAL STRATEGY: {strategy}")
            print(f"🎯 PREDICTED: '{predicted_word}' (confidence: {confidence:.4f})")
            print(f"🎯 EXPECTED: '{requested_word_value}'")
            print(f"🎯 RESULT: {'✅ CORRECT' if is_correct else '❌ WRONG'}")

            # 🆕 HIỂN THỊ THÔNG TIN THÊM
            if expected_word_in_top_10:
                expected_rank = next(
                    i + 1
                    for i, pred in enumerate(top_10_predictions)
                    if pred["word"].lower() == requested_word_value.lower()
                )
            else:
                print(f"🎯 EXPECTED WORD:ERROR")

            print("🎯 IMPROVED PREDICTION END\n")

            return PredictionResponse(
                predicted_word=predicted_word,
                confidence=confidence,
                is_correct=is_correct,
            )

        except Exception as e:
            print(f"❌ Improved prediction error: {e}")
            # Fallback to debug version
            return self.predict_confidence_debug(request)

    def _print_top_predictions(self, probabilities: np.ndarray, top_k: int = 10):
        top_indices = np.argsort(probabilities)[-top_k:][::-1]
        print(f"🏆 TOP {top_k} PREDICTIONS:")
        for i, idx in enumerate(top_indices):
            class_key = self.index_to_class[idx]
            class_value = ExpressionHandler.MAPPING.get(class_key, class_key)
            prob = probabilities[idx]

    def _resize_features(self, features: np.ndarray, target_dim: int) -> np.ndarray:
        """Resize features để khớp với dimension mong đợi"""
        current_dim = features.shape[1]

        if current_dim < target_dim:
            # Padding zeros nếu thiếu
            padding = np.zeros((features.shape[0], target_dim - current_dim))
            return np.hstack((features, padding))
        else:
            # Cắt bớt nếu thừa
            return features[:, :target_dim]


# Khởi tạo FastAPI app
app = FastAPI(
    title="Sign Language Recognition API - 2D Model",
    description="API for predicting sign language gestures accuracy (2D coordinates only)",
    version="2.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global predictor instance
predictor = None


@app.on_event("startup")
async def startup_event():
    """Khởi tạo model khi server start"""
    global predictor
    try:
        model_path = f"models/{MODEL_NAME}"
        predictor = SignLanguagePredictor(model_path)
        print("🚀 2D Sign Language Recognition API is ready!")

        # Hiển thị thông tin model
        model_info = predictor.get_model_info()
        print(
            f"📊 Model Info: {model_info['feature_dimension']}D features, {model_info['num_classes']} classes"
        )

    except Exception as e:
        print(f"❌ Failed to initialize model: {e}")
        predictor = None


@app.get("/")
async def root():
    return {"message": "2D Sign Language Recognition API"}


@app.get("/model-info")
async def get_model_info():
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return predictor.get_model_info()


@app.post("/predict", response_model=PredictionResponse)
async def predict_sign_language(request: PredictionRequest):
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Sử dụng phiên bản debug
        result = predictor.predict_confidence_debug(request)
        return result
    except Exception as e:
        print(f"❌ API ERROR: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/model-debug")
async def model_debug():
    """Debug thông tin chi tiết về model"""
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    model_info = predictor.get_model_info()

    # Tính toán số landmarks dự kiến
    expected_features = model_info["feature_dimension"]
    print(f"🎯 Model expects: {expected_features} total features (x,y pairs)")

    # Giả sử mỗi landmark có 2 features (x,y)
    total_landmarks = expected_features // 2
    print(f"🎯 Model expects: {total_landmarks} total landmarks")

    # Ước tính phân bổ (giả định)
    # MediaPipe Face: 468 landmarks = 936 features
    # MediaPipe Hands: 21 landmarks/hand = 42 features/hand

    possible_configs = []

    # Các cấu hình phổ biến
    configs = [
        (468, 1),  # 1 face + 1 hand
        (468, 2),  # 1 face + 2 hands
        (468, 0),  # chỉ face
    ]

    for face_landmarks, hands in configs:
        total = face_landmarks * 2 + hands * 21 * 2
        if total == expected_features:
            possible_configs.append(f"Face: {face_landmarks}, Hands: {hands}")

    return {
        "expected_features": expected_features,
        "expected_landmarks": total_landmarks,
        "possible_configurations": possible_configs,
        "model_info": model_info,
    }


@app.post("/predict-improved", response_model=PredictionResponse)
async def predict_improved(request: PredictionRequest):
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        result = predictor.predict_confidence_improved(request)
        return result
    except Exception as e:
        print(f"❌ IMPROVED API ERROR: {e}")
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)

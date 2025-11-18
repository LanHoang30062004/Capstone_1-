import numpy as np
from config import *


def extract_hand_result_api(mp_hands, hand_results):
    if not hand_results.multi_hand_landmarks:
        return np.zeros(42 * 2)  # 84 nếu không có tay

    num_hands = len(hand_results.multi_hand_landmarks)
    handedness = hand_results.multi_handedness

    if num_hands == 1:
        hand_array = extract_single_hand_api(mp_hands, hand_results.multi_hand_landmarks[0])
        if handedness[0].classification[0].label == "Right":
            return np.hstack((hand_array, np.zeros(42)))   # Right | Zero Left
        else:
            return np.hstack((np.zeros(42), hand_array))   # Zero Right | Left
    else:
        if handedness[0].classification[0].label == "Right":
            right_hand = hand_results.multi_hand_landmarks[0]
            left_hand = hand_results.multi_hand_landmarks[1]
        else:
            left_hand = hand_results.multi_hand_landmarks[0]
            right_hand = hand_results.multi_hand_landmarks[1]

        left_hand_array = extract_single_hand_api(mp_hands, left_hand)
        right_hand_array = extract_single_hand_api(mp_hands, right_hand)

        return np.hstack((left_hand_array, right_hand_array))  # 84 features



def extract_single_hand_api(mp_hands, hand_landmarks):
    """
    Trích xuất 21 landmark với 2 giá trị (x, y) cho 1 bàn tay.
    Flatten thành vector 42 chiều.
    """
    landmarks_array = np.zeros((21, 2))  # x, y

    def safe_get(i):
        if hand_landmarks and i < len(hand_landmarks.landmark):
            lm = hand_landmarks.landmark[i]
            return np.array([lm.x, lm.y])
        return np.array([0.0, 0.0])

    for idx, landmark_enum in enumerate(mp_hands.HandLandmark):
        landmarks_array[idx] = safe_get(landmark_enum.value)

    return landmarks_array.flatten()  # 42 phần tử




def extract_face_result_api(face_results):
    """Trích xuất đặc trưng từ mặt (mean x,y), hoặc [0,0] nếu không có."""
    if (
        not face_results.multi_face_landmarks
        or len(face_results.multi_face_landmarks) == 0
    ):
        return np.array([0.0, 0.0])

    single_face = face_results.multi_face_landmarks[0]
    if not single_face.landmark or len(single_face.landmark) == 0:
        return np.array([0.0, 0.0])

    face_array = np.array([[lm.x, lm.y] for lm in single_face.landmark])
    return np.mean(face_array, axis=0)


def extract_features_api(mp_hands, face_results, hand_results):
    """Kết hợp đặc trưng mặt + tay"""
    face_features = extract_face_result_api(face_results)
    hand_features = extract_hand_result_api(mp_hands, hand_results)
    return np.hstack((face_features, hand_features))

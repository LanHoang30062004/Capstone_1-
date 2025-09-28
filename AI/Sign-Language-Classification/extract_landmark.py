import cv2
import mediapipe as mp
import numpy as np
import streamlit as st
import warnings
import json

from utils.feature_extraction import *
from utils.strings import *
from utils.model import ASLClassificationModel
from config import MODEL_NAME, MODEL_CONFIDENCE

warnings.filterwarnings("ignore")

# Initialize MediaPipe
mp_face_mesh = mp.solutions.face_mesh
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils


def landmarks_to_list(landmarks):
    """Convert mediapipe landmarks to list of dicts (x,y,z)."""
    return [{"x": lm.x, "y": lm.y, "z": lm.z} for lm in landmarks.landmark]


if __name__ == "__main__":
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        st.error("Cannot open webcam. Please check your camera connection.")
        st.stop()

    # Streamlit UI
    st.set_page_config(layout="wide")
    col1, col2 = st.columns([4, 2])
    with col1:
        video_placeholder = st.empty()
    with col2:
        prediction_placeholder = st.empty()

    # Load model
    try:
        model = ASLClassificationModel.load_model(f"models/{MODEL_NAME}")
    except Exception as e:
        st.error(f"Error loading model: {str(e)}")
        st.stop()

    # Initialize mediapipe
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

    print("Starting application ...")

    while cap.isOpened():
        try:
            success, image = cap.read()
            if not success:
                continue

            image.flags.writeable = False
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            face_results = face_mesh.process(image)
            hand_results = hands.process(image)

            # === Collect landmarks into JSON dict ===
            keypoints = {"left_hand": [], "right_hand": []}


            # Hands (21 points each)
            if hand_results.multi_hand_landmarks and hand_results.multi_handedness:
                for idx, hand_landmarks in enumerate(hand_results.multi_hand_landmarks):
                    handedness = hand_results.multi_handedness[idx].classification[0].label.lower()
                    if handedness == "left":
                        keypoints["left_hand"] = landmarks_to_list(hand_landmarks)
                    else:
                        keypoints["right_hand"] = landmarks_to_list(hand_landmarks)

            # In ra JSON (console)
            print(json.dumps(keypoints))

            # Vẽ landmarks lên frame
            if face_results.multi_face_landmarks:
                for face_landmarks in face_results.multi_face_landmarks:
                    mp_drawing.draw_landmarks(
                        image=image,
                        landmark_list=face_landmarks,
                        connections=mp_face_mesh.FACEMESH_TESSELATION,
                        landmark_drawing_spec=None,
                        connection_drawing_spec=mp_drawing.DrawingSpec(
                            color=(0, 255, 0), thickness=1, circle_radius=1
                        ),
                    )

            if hand_results.multi_hand_landmarks:
                for hand_landmarks in hand_results.multi_hand_landmarks:
                    mp_drawing.draw_landmarks(
                        image=image,
                        landmark_list=hand_landmarks,
                        connections=mp_hands.HAND_CONNECTIONS,
                        landmark_drawing_spec=mp_drawing.DrawingSpec(
                            color=(0, 0, 255), thickness=2, circle_radius=2
                        ),
                        connection_drawing_spec=mp_drawing.DrawingSpec(
                            color=(0, 255, 0), thickness=2, circle_radius=2
                        ),
                    )

            # Hiển thị video
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            video_placeholder.image(image, channels="BGR", use_column_width=True)
            prediction_placeholder.markdown(
                f"""<h3>Keypoints JSON is being printed in console</h3>""",
                unsafe_allow_html=True,
            )

        except Exception as e:
            print(f"Error in main loop: {e}")
            continue

    cap.release()
    cv2.destroyAllWindows()

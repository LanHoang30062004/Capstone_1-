# app.py
import streamlit as st
import cv2
import mediapipe as mp
import numpy as np
from PIL import Image
import warnings

# Import custom utils
from utils.feature_extraction import extract_features
from utils.strings import ExpressionHandler
from utils.model import ASLClassificationModel
from config import MODEL_NAME, MODEL_CONFIDENCE

warnings.filterwarnings("ignore")

# ==============================
# CONFIG & STYLE
# ==============================
st.set_page_config(page_title="Chuyển đổi ngôn ngữ ký hiệu", layout="wide")

st.markdown(
    """
    <style>
    .title {
        font-size: 28px;
        color: #2f7a2f;
        font-weight: 700;
        margin-bottom: 15px;
    }
    .prediction-box {
        margin-top: 15px;
        padding: 10px;
        border: 1px solid #ddd;
        background: #fafafa;
        font-size: 16px;
    }
    .big-font {
        color: #e76f51 !important;
        font-size: 36px !important;
        border: 0.2rem solid #fcbf49 !important;
        border-radius: 1rem;
        text-align: center;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown(
    '<div class="title">Chuyển đổi ngôn ngữ ký hiệu</div>', unsafe_allow_html=True
)

# ==============================
# SIDEBAR
# ==============================
mode = st.sidebar.radio("Chọn chế độ:", ["Video to Text", "Text to Video"], index=0)

# ==============================
# VIDEO TO TEXT
# ==============================
if mode == "Video to Text":
    st.subheader("Chuyển đổi Video → Văn bản")

    source = st.radio("Chọn nguồn video:", ["Sử dụng webcam", "Tải lên video"])

    if source == "Sử dụng webcam":
        st.write("Đang mở webcam...")

        # Khởi tạo webcam
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            st.error("Không mở được webcam. Vui lòng kiểm tra camera.")
            st.stop()

        # Load model
        try:
            model = ASLClassificationModel.load_model(f"models/{MODEL_NAME}")
        except Exception as e:
            st.error(f"Lỗi tải model: {str(e)}")
            st.stop()

        # Mediapipe init
        mp_face_mesh = mp.solutions.face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=MODEL_CONFIDENCE,
            min_tracking_confidence=MODEL_CONFIDENCE,
        )
        mp_hands = mp.solutions.hands.Hands(
            max_num_hands=2,
            min_detection_confidence=MODEL_CONFIDENCE,
            min_tracking_confidence=MODEL_CONFIDENCE,
        )
        mp_drawing = mp.solutions.drawing_utils

        expression_handler = ExpressionHandler()

        col1, col2 = st.columns([4, 2])
        video_placeholder = col1.empty()
        prediction_placeholder = col2.empty()

        while cap.isOpened():
            success, image = cap.read()
            if not success:
                continue

            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            face_results = mp_face_mesh.process(image)
            hand_results = mp_hands.process(image)

            try:
                feature = extract_features(mp_hands, face_results, hand_results)
                if feature is not None:
                    expression = model.predict(feature)
                    expression_handler.receive_old(expression)
                else:
                    expression_handler.receive_old("Không nhận diện được")
            except Exception as e:
                expression_handler.receive_old("Lỗi xử lý")

            # Hiển thị
            video_placeholder.image(image, channels="RGB", use_column_width=True)
            prediction_placeholder.markdown(
                f"""<div class="big-font">{expression_handler.get_message_old()}</div>""",
                unsafe_allow_html=True,
            )

        cap.release()
        cv2.destroyAllWindows()

    else:
        uploaded = st.file_uploader(
            "Tải video/ảnh lên", type=["mp4", "mov", "jpg", "jpeg", "png"]
        )
        if uploaded:
            if uploaded.type.startswith("image"):
                img = Image.open(uploaded)
                st.image(img, caption="Ảnh tải lên", use_column_width=True)
                st.info("📌 Demo: chưa tích hợp nhận diện ảnh.")
            else:
                st.video(uploaded)
                st.info("📌 Demo: chưa tích hợp xử lý video upload.")

# ==============================
# TEXT TO VIDEO
# ==============================
else:
    st.subheader("Chuyển đổi Văn bản → Video")

    text_input = st.text_area("Nhập văn bản:", placeholder="Ví dụ: Xin chào")
    if st.button("Chuyển đổi"):
        if text_input.strip() == "":
            st.warning("Vui lòng nhập văn bản trước khi chuyển đổi.")
        else:
            st.success(f"Đang hiển thị video cho văn bản: {text_input}")
            # 📌 Demo video xuất ra (mock)
            st.video("sample_videos/demo_sign_language.mp4")

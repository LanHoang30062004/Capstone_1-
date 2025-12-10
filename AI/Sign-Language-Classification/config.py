# Pose Estimation Configuration
FEATURES_PER_HAND = 21

# Name of the model
MODEL_NAME = "simple_conservation_7_expression_model.pkl"
MODEL_CONSERVATION = "simple_conservation_4_expression_model.pkl"
MODEL_CONFIDENCE = 0.7

# Processing parameters
MAX_PROCESSING_TIME = 30  # Maximum processing time in seconds
TARGET_FPS = 10  # Target frames per second for processing
MIN_FRAME_COUNT = 30  # Minimum number of frames to process
MIN_FRAMES_PER_CHUNK = 10  # Chunks ít hơn 10 frames thì bỏ qua

# Thêm các tham số mới
MIN_FRAMES_PER_GESTURE = 8  # Số frame tối thiểu để xác nhận một cử chỉ
GESTURE_SIMILARITY_THRESHOLD = 0.7  # Ngưỡng similarity để gộp cử chỉ

MAX_CONCURRENT_VIDEOS = 10

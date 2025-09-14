# Pose Estimation Configuration
FEATURES_PER_HAND = 21

# Name of the model
MODEL_NAME = "simple_9_expression_model.pkl"
MODEL_CONFIDENCE = 0.5

# Processing parameters
MAX_PROCESSING_TIME = 10  # Maximum processing time in seconds
TARGET_FPS = 10  # Target frames per second for processing
MIN_FRAME_COUNT = 30  # Minimum number of frames to process

# Thêm các tham số mới
MIN_FRAMES_PER_GESTURE = 8  # Số frame tối thiểu để xác nhận một cử chỉ
GESTURE_SIMILARITY_THRESHOLD = 0.7  # Ngưỡng similarity để gộp cử chỉ
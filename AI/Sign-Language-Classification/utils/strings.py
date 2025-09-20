class ExpressionHandler:
    MAPPING = {
        "bình_thường": "Ngồi yên",
        "cảm_ơn": "Cảm ơn",
        "xin_chào": "Xin chào",
        "yêu": "Yêu",
        "không": "Không",
        "toi": "Tôi",
        "ten_la": "Tên là",
        "a": "a", "b": "b", "c": "c", "d": "d",
        "e": "e", "g": "g", "h": "h", "i": "i",
        "k": "k", "l": "l", "n": "n", "m": "m",
        "o": "o", "p": "p", "q": "q", "r": "r",
        "u": "u", "v": "v",
        "No hands/face detected": "❌ Không phát hiện tay/mặt",
        "Error in detection": "⚠️ Lỗi phát hiện",
        "quoc_te_phu_nu": "ngày Quốc tế phụ nữ 8/3",
        "giai_phong_thu_do": "Ngày giải phóng thủ đô 10/10",
        "giai_phong_mien_nam": "Ngày giải phóng miền Nam 30/4",
        "nguoi_khuyet_tat_viet_nam_18_4": "ngày Người khuyết tật Việt Nam 18/4",
        "nguoi_khuyet_tat_the_gioi_3_12": "ngày Người khuyết tật Thế giới 3/12",
        "halloween": "lễ Halloween 31/10",
        "ngay_phu_nu_viet_nam": "ngày Phụ nữ Việt Nam 20/10"
    }

    def __init__(self, min_frames_per_gesture=5, similarity_threshold=0.7):
        self.predictions = []  # Lưu tất cả predictions theo thời gian
        self.current_gesture = None
        self.gesture_start_frame = 0
        self.min_frames_per_gesture = min_frames_per_gesture
        self.similarity_threshold = similarity_threshold
        self.sequence = []  # Chuỗi cử chỉ đã nhận diện

    def receive(self, prediction):
        # Chuyển đổi prediction thành dạng chuẩn (lowercase) để so sánh
        normalized_prediction = prediction.strip().lower(
        ) if isinstance(prediction, str) else str(prediction)
        self.predictions.append(normalized_prediction)

        # Nếu cử chỉ thay đổi
        if self.current_gesture != normalized_prediction:
            # Nếu cử chỉ cũ tồn tại đủ lâu, thêm vào sequence (đã mapped)
            if (self.current_gesture and
                    len(self.predictions) - self.gesture_start_frame >= self.min_frames_per_gesture):
                mapped_gesture = self.MAPPING.get(
                    self.current_gesture, self.current_gesture)
                self.sequence.append(mapped_gesture)

            self.current_gesture = normalized_prediction
            self.gesture_start_frame = len(self.predictions)

    def get_sequence(self):
        # Thêm cử chỉ cuối cùng nếu tồn tại đủ lâu (đã mapped)
        if (self.current_gesture and
                len(self.predictions) - self.gesture_start_frame >= self.min_frames_per_gesture):
            mapped_gesture = self.MAPPING.get(
                self.current_gesture, self.current_gesture)
            self.sequence.append(mapped_gesture)

        # Loại bỏ cử chỉ trùng lặp liên tiếp và thêm khoảng trắng giữa các từ
        cleaned_sequence = []
        for gesture in self.sequence:
            if not cleaned_sequence or gesture != cleaned_sequence[-1]:
                # Thêm khoảng trắng nếu là từ mới (không phải ký tự đơn)
                if (cleaned_sequence and
                    len(gesture) > 1 and
                        len(cleaned_sequence[-1]) > 1):
                    cleaned_sequence.append(" ")
                cleaned_sequence.append(gesture)

        return "".join(cleaned_sequence)

    def get_message(self):
        sequence = self.get_sequence()
        # Đảm bảo chuỗi kết quả được format đẹp
        return sequence.strip()

    def get_raw_predictions(self):
        """Trả về chuỗi predictions gốc (cho debug)"""
        return "".join(self.predictions)

    def receive_old(self, message):
        self.current_message = message

    def get_message_old(self):
        return ExpressionHandler.MAPPING[self.current_message]

class ExpressionHandler:
    MAPPING = {
        "binh_thuong": "Ngồi yên",
        "cảm_ơn": "Cảm ơn",
        "xin_chao": "Xin chào",
        "yêu": "Yêu",
        "không": "Không",
        "toi": "Tôi",
        "ten_la": "Tên là",
        "tuoi": "tuổi",
        "song_o": "sống ở",
        "rat_vui_duoc_gap_ban": "rất vui được gặp bạn",
        "hen_gap_lai": "hẹn gặp lại",
        "cau_hoi": "câu hỏi",
        "khoe": "khỏe",
        "ban": "bạn",
        "den_tu": "đến từ",
        "1": "1",
        "2": "2",
        "a": "a",
        "b": "b",
        "c": "c",
        "d": "d",
        "e": "e",
        "g": "g",
        "h": "h",
        "i": "i",
        "k": "k",
        "l": "l",
        "n": "n",
        "m": "m",
        "o": "o",
        "p": "p",
        "q": "q",
        "r": "r",
        "u": "u",
        "v": "v",
        "ngay_thuong_binh_lietsi": "ngày thương bình liệt sĩ 27/7",
        "ngay_gio_to_hungvuong": "ngày giỗ tổ Hùng Vương (âm lịch 10/3)",
        "ngay_ngon_ngu_ki_hieu_quocte": "ngày Ngôn ngữ kí hiệu Quốc tế 23/9",
        "tuan_le_nguoi_diec_thegioi": "tuần lễ người Điếc thế giới",
        "ngay_cua_me": "ngày của Mẹ",
        "ngay_cua_cha": "ngày của Cha",
        "ngay_gia_dinh_vn": "ngày gia đình Việt Nam 28/6",
        "noi_da_ga": "nổi da gà",
        "ghen_ti": "ghen tị",
        "lung_tung": "lung tung",
        "hoi_dau": "hói đầu",
        "cuoi_nhech_mep": "cười nhếch mép",
        "cuoi_vo_bung": "cười vỡ bụng",
        "tham_an": "tham ăn",
        "them": "thèm",
        "them_ro_dai": "thèm rỏ dãi",
        "dung_dau": "đứng đầu (hàng đầu)",
        "thoi_quen": "thói quen",
        "No hands/face detected": "❌ Không phát hiện tay/mặt",
        "Error in detection": "⚠️ Lỗi phát hiện",
        "a_rap": "Ả Rập",
        "dia_chi": "Địa chỉ",
        "do_thai": "Do Thái",
        "dubai": "Dubai",
        "ma_cao": "Ma Cao",
        "mien_dien": "Miến Điện",
        "nguoi_nuoc_ngoai": "Người nước ngoài",
        "nhan_vien": "Nhân viên",
        "nhap_khau": "Nhập khẩu",
        "phuong_dong": "Phương Đông",
        "phuong_tay": "Phương Tây",
        "quy_nhon": "Quy Nhơn",
        "tiep_tan": "Tiếp tân",
        "tinh": "Tỉnh",
        "tuy_hoa": "Tuy Hòa",
        "khuyen_khich": "Khuyến khích",
        "khong_nghe_loi": "Không nghe lời",
        "ai_cho": "Ai cho",
        "khong_cho": "Không cho",
        "khong_can": "Không cần",
        "khong_nen": "Không nên",
        "buc_minh": "Bực mình",
        "tu_giac": "Tự giác",
        "mu_chu": "Mù chữ",
        "vo_tinh": "Vô tình",
        "tet_han_thuc": "Tết Hàn Thực",
        "gio": "Giỗ",
        "quoc_te_phu_nu": "ngày Quốc tế phụ nữ 8/3",
        "giai_phong_thu_do": "Ngày giải phóng thủ đô 10/10",
        "giai_phong_mien_nam": "Ngày giải phóng miền Nam 30/4",
        "nguoi_khuyet_tat_viet_nam_18_4": "ngày Người khuyết tật Việt Nam 18/4",
        "nguoi_khuyet_tat_the_gioi_3_12": "ngày Người khuyết tật Thế giới 3/12",
        "halloween": "lễ Halloween 31/10",
        "ngay_phu_nu_viet_nam": "ngày Phụ nữ Việt Nam 20/10",
    }

    def __init__(self, min_frames_per_gesture=5, similarity_threshold=0.7):
        self.predictions = []  # Lưu tất cả predictions theo thời gian
        self.current_gesture = None
        self.gesture_start_frame = 0
        self.min_frames_per_gesture = min_frames_per_gesture
        self.similarity_threshold = similarity_threshold
        self.sequence = []  # Chuỗi cử chỉ đã nhận diện (đã mapped)

    def receive(self, prediction):
        # Chuyển đổi prediction thành dạng chuẩn (lowercase) để so sánh
        normalized_prediction = (
            prediction.strip().lower()
            if isinstance(prediction, str)
            else str(prediction)
        )
        self.predictions.append(normalized_prediction)

        # Nếu cử chỉ thay đổi
        if self.current_gesture != normalized_prediction:
            # Nếu cử chỉ cũ tồn tại đủ lâu, thêm vào sequence (đã mapped)
            if (
                self.current_gesture
                and len(self.predictions) - self.gesture_start_frame
                >= self.min_frames_per_gesture
            ):
                # LUÔN mapping từ key sang value trước khi thêm vào sequence
                mapped_gesture = self.MAPPING.get(
                    self.current_gesture, self.current_gesture
                )
                self.sequence.append(mapped_gesture)

            self.current_gesture = normalized_prediction
            self.gesture_start_frame = len(self.predictions)

    def get_sequence(self):
        # Thêm cử chỉ cuối cùng nếu tồn tại đủ lâu
        if (
            self.current_gesture
            and len(self.predictions) - self.gesture_start_frame
            >= self.min_frames_per_gesture
        ):
            # LUÔN mapping từ key sang value
            mapped_gesture = self.MAPPING.get(
                self.current_gesture, self.current_gesture
            )
            self.sequence.append(mapped_gesture)

        if not self.sequence:
            return ""

        # Loại bỏ trùng lặp liên tiếp
        unique_sequence = []
        for gesture in self.sequence:
            if not unique_sequence or gesture != unique_sequence[-1]:
                unique_sequence.append(gesture)

        # Nhóm ký tự đơn và từ
        result_parts = []
        current_chars = []  # Các ký tự đơn đang ghép

        for gesture in unique_sequence:
            # Xử lý ký tự đơn (A-Z, 0-9, v.v.)
            if len(gesture) == 1 and gesture.isalnum():
                current_chars.append(gesture)
            else:  # Từ đa ký tự hoặc ký tự đặc biệt
                # Ghép các ký tự đơn trước đó thành từ
                if current_chars:
                    result_parts.append("".join(current_chars))
                    current_chars = []
                # Thêm từ đa ký tự
                result_parts.append(gesture)

        # Thêm phần còn lại
        if current_chars:
            result_parts.append("".join(current_chars))

        return ", ".join(result_parts)

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
        return ExpressionHandler.MAPPING.get(self.current_message, self.current_message)

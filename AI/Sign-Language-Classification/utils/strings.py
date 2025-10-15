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
        "ban_yeu_toi": "Bạn yêu tôi",
        "toi_yeu_ban_ay": "Tôi yêu bạn ấy",
        "ban_ay_yeu_toi": "Bạn ấy yêu tôi",
        "ban_yeu_ban_ay": "Bạn yêu bạn ấy",
        "ban_ay_yeu_ban": "Bạn ấy yêu bạn",
        "anh_hai_anh_ca": "Anh hai, anh cả",
        "chi_hai_chi_ca": "Chị hai, chị cả",
        "qua_bau_ho_lo": "Quả bầu hồ lô",
        "mot_la": "Một là",
        "hai_la": "Hai là",
        "ba_la": "Ba là",
        "bon_la": "Bốn là",
        "nam_la": "Năm là",
        "ong_ba": "Ông bà",
        "em_ho": "Em họ",
        "chau_ho": "Cháu họ",
        "song_sot": "Sống sót",
        "thuong_xuyen": "Thường xuyên",
        "di_dao": "Đi dạo",
        "ve_sai_gon": "Về (Sài Gòn)",
        "phong_toa": "Phong toả",
        "thung_lung": "Thung lũng",
        "dia_hinh": "Địa hình",
        "kim_dong": "Kim đồng",
        "thanh_giong": "Thánh gióng",
        "hoa_giay": "Hoa giấy",
        "hoa_dam_but": "Hoa dâm bụt",
        "ket_luan": "Kết luận",
        "internet": "Internet",
        "di_ve_sinh": "Đi vệ sinh",
        "hoa_mai": "Hoa mai",
        "aw": "ă",
        "aa": "â",
        "b": "b",
        "c": "c",
        "d": "d",
        "dd": "đ",
        "ow": "ơ",
        "dau_huyen": "Dấu huyền",
        "dau_sac": "Dấu sắc",
        "dau_hoi": "Dấu hỏi",
        "dau_nang": "Dấu nặng",
        "khong_co": "Không có",
        "khong_co_chi": "Không có chi",
        "dan_chu": "Dân chủ",
        "xu_ly": "Xử lý",
        "dat_ruong": "Đất ruộng",
        "tinh_mat": "Tinh mắt",
        "cung_vay": "Cũng vậy",
        "dung_khong": "Đúng không?",
        "phai_khong": "Phải không?",
        "con_ban": "Còn bạn?",
        "can_khong": "Cần không?",
        "nen_khong": "Nên không?",
        "kia": "Kia",
        "nong_tinh": "Nóng tính",
        "so_khong": "Sợ không?",
        "cam_thu": "Căm thù",
        "dep_khong": "Đẹp không?",
        "khong_dep": "Không đẹp",
        "cac_ban": "Các bạn (2 người)",
        "chung_toi_1": "Chúng tôi",
        "chung_toi_2": "Chúng tôi (2 người)",
        "chung_toi_3": "Chúng tôi (3 người)",
        "chung_toi_4": "Chúng tôi (4 người)",
        "chung_toi_5": "Chúng tôi (5 người)",
        "ho_2": "Họ (2 người)",
        "ho_1": "Họ",
        "sinh_to": "Sinh tố",
        "vat_chanh": "Vắt chanh",
        "mia": "Mía",
        "chanh_da": "Chanh đá",
        "chanh_nong": "Chanh nóng",
        "chanh_muoi": "Chanh muối",
        "tra_da": "Trà đá",
        "tra_nong": "Trà nóng",
        "tra_sua": "Trà sữa",
        "socola": "Socola",
        "cocacola": "CocaCola",
        "7up": "7up",
        "mot_tiet_hoc": "Một tiết học",
        "mot_tieng": "Một tiếng",
        "chung_tay": "Chung tay",
        "rua_chan": "Rửa chân",
        "rua_mat": "Rửa mặt",
        "danh_rang": "Đánh răng",
        "tuan_nay": "Tuần này",
        "tuan_sau": "Tuần sau",
        "tuan_truoc": "Tuần trước",
        "cuoi_tuan": "Cuối tuần",
        "cuoi_thang": "Cuối tháng",
        "cuoi_nam": "Cuối năm",
        "muc_tieu": "Mục tiêu",
        "sinh_doi": "Sinh đôi",
        "doi": "Đôi",
        "dang": "Đảng",
        "mo_ta": "Mô tả",
        "mum_mim": "Mũm mĩm",
        "toc_dai": "Tóc dài",
        "toc_ngan": "Tóc ngắn",
        "tong_ket": "Tổng kết/bế giảng",
        "loc_xoay": "Lốc xoáy",
        "tay_chan_sach_se": "Tay chân sạch sẽ",
        "nham_mat": "Nhắm mắt",
        "so": "Sờ",
        "cay_nen": "Cây nến",
        "diu_dang": "Dịu dàng",
        "dua": "Đùa",
        "lam_duoc": "Làm được",
        "dong_song_chay": "Dòng sông chảy",
        "an_du": "Ăn đủ",
        "an_vua": "Ăn vừa",
        "an_it": "Ăn ít",
        "do_uong": "Đồ uống",
        "do_an": "Đồ ăn",
        "trang_diem": "Trang điểm",
        "dau_mat_do": "Đau mắt đỏ",
        "cai_vot_ca": "Cái vợt cá",
        "vot_cau_long": "Vợt câu lông",
        "con_vuon": "Con vượn",
        "thap_den": "Thắp đèn",
        "gop_tien": "Góp tiền",
        "hop_nhom": "Họp nhóm",
        "nhut_nhat": "Nhút nhát",
        "luoc_rau": "Luộc rau",
        "muoi": "Muối",
        "nuoc_mam": "Nước mắm",
        "thoan_thoat": "Thoăn thoắt",
        "dua_doi": "Đua đòi",
        "binh_sua": "Bình sữa",
        "doi": "Đòi",
        "doi_hoi": "Đòi hỏi",
        "tre_con": "Trẻ con",
        "duy_nhat": "Duy nhất",
        "canh_tranh": "Cạnh tranh",
        "hoa_hau": "Hoa hậu",
        "cai_neo": "Cái neo",
        "phong_vien": "Phóng viên",
        "nha_van_hoa": "Nhà văn hóa",
        "chua_yen_tu": "Chùa Yên Tử",
        "cho_xoi": "Chõ xôi",
        "cay_co": "Cây cọ",
        "khu_vuc_cach_ly": "Khu vực cách ly",
        "ngay_thay_thuoc_VN": "Ngày Thầy thuốc VN",
        "ngay_thanh_lap_QDNDVN": "Ngày thành lập Quân đội Nhân dân Việt Nam",
        "con_ca_sau": "Con cá sấu",
        "nham": "Nhầm",
        "dong_bang_song_CL": "Đồng bằng sông Cửu Long",
        "dong_bang_song_hong": "Đồng bằng sông Hồng",
        "dong_bang_duyen_hai_mien_trung": "Đồng bằng duyên hải miền Trung",
        "buon_tham": "Buồn thảm",
        "mach": "Mách",
        "vo_duyen": "Vô duyên",
        "ti_hi_mat": "Ti hí mắt",
        "kip_thoi": "Kịp thời",
        "boi_roi": "Bối rối",
        "hu_via": "Hú vía",
        "suyts": "Suýt",
        "suytj": "Suỵt",
        "ca_voi": "Cá voi",
        "ca_kiem": "Cá kiếm",
        "duoi_ca": "Đuôi cá",
        "duoi_chuot": "Đuôi chuột",
        "bo_bit_tet": "Bò bít tết",
        "sup": "Súp",
        "sup_lo": "Súp lơ",
        "mi_tom": "Mì tôm",
        "ve_2": "về",
        "ve_3": "về",
        "ve_4": "về",
        "ve_5": "về",
        "hen": "hẹn",
        "quyen_luyen": "quyến luyến",
        "hua": "hứa",
        "cung": "cùng",
        "lau": "lâu",
        "van": "vẫn",
        "moi_ngay": "mỗi ngày",
        "an_bang_thia": "ăn bằng thìa",
        "an_vu_sua": "ăn vú sữa",
        "hoi": "hỏi",
        "trong_nha": "trông nhà",
        "chay": "chạy",
        "xe_container": "xe container",
        "bay_nhanh": "bay nhanh",
        "cham_chap": "chậm chạp",
        "ngung_lai": "ngừng lại",
        "cung_dien": "cung điện",
        "dung_lai": "dừng lại",
        "mot_chut": "một chút",
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

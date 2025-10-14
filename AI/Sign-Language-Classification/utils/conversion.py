def convert_to_mp_face_results(face_landmarks):
    """Chuyển face landmarks (list of dicts OR objects) thành fake MediaPipe FaceResults.
    - Nếu không có landmark -> pad 468 điểm (full zero).
    """

    class FakeLandmark:
        def __init__(self, x, y, z):
            self.x = x
            self.y = y
            self.z = z

    class FakeFaceLandmarksList:
        def __init__(self, landmarks):
            fake_landmarks = []
            if not landmarks or len(landmarks) == 0:
                # pad đủ 468 điểm nếu rỗng
                fake_landmarks = [FakeLandmark(0.0, 0.0, 0.0) for _ in range(468)]
            else:
                for lm in landmarks:
                    if isinstance(lm, dict):
                        x = lm.get("x", 0.0)
                        y = lm.get("y", 0.0)
                        z = lm.get("z", 0.0)
                    else:
                        x = getattr(lm, "x", 0.0)
                        y = getattr(lm, "y", 0.0)
                        z = getattr(lm, "z", 0.0)
                    fake_landmarks.append(FakeLandmark(x, y, z))
            self.landmark = fake_landmarks

    class FakeFaceResults:
        def __init__(self, landmarks):
            self.multi_face_landmarks = [FakeFaceLandmarksList(landmarks)]

    return FakeFaceResults(face_landmarks)


def convert_to_mp_hand_results(hand_landmarks_list):
    """Chuyển hand landmarks (list of dicts OR objects) thành fake MediaPipe Hand Results.
    - đảm bảo mỗi hand có 21 landmarks (pad nếu thiếu).
    - chuẩn hóa handedness -> "Left" hoặc "Right".
    """

    class FakeLandmark:
        def __init__(self, x, y, z):
            self.x = x
            self.y = y
            self.z = z

    class FakeHandLandmarksList:
        def __init__(self, landmarks):
            self.landmark = landmarks

    class FakeClassification:
        def __init__(self, label, score=0.9):
            self.label = label
            self.score = score

    class FakeClassificationList:
        def __init__(self, label, score=0.9):
            self.classification = [FakeClassification(label, score)]

    class FakeHandResults:
        def __init__(self):
            self.multi_hand_landmarks = []
            self.multi_handedness = []

    results = FakeHandResults()

    if not hand_landmarks_list or not isinstance(hand_landmarks_list, list):
        return results

    for hand in hand_landmarks_list:
        try:
            # lấy label và raw_landmarks tùy kiểu input
            if isinstance(hand, dict):
                handedness_label = (
                    hand.get("handedness") or hand.get("label") or "Unknown"
                )
                raw_landmarks = hand.get("landmarks", []) or []
            else:
                handedness_label = getattr(
                    hand, "handedness", getattr(hand, "label", "Unknown")
                )
                raw_landmarks = getattr(hand, "landmarks", []) or []

            # chuẩn hóa handedness
            handedness_label = str(handedness_label).capitalize()
            if handedness_label not in ["Left", "Right"]:
                handedness_label = "Unknown"

            # convert landmark
            landmarks = []
            for lm in raw_landmarks:
                if isinstance(lm, dict):
                    x = lm.get("x", 0.0)
                    y = lm.get("y", 0.0)
                    z = lm.get("z", 0.0)
                else:
                    x = getattr(lm, "x", 0.0)
                    y = getattr(lm, "y", 0.0)
                    z = getattr(lm, "z", 0.0)
                landmarks.append(FakeLandmark(x, y, z))

            # pad nếu thiếu hoặc rỗng
            if len(landmarks) != 21:
                if len(landmarks) == 0:
                    landmarks = [FakeLandmark(0.0, 0.0, 0.0) for _ in range(21)]
                else:
                    last = landmarks[-1]
                    while len(landmarks) < 21:
                        landmarks.append(FakeLandmark(last.x, last.y, last.z))

            results.multi_hand_landmarks.append(FakeHandLandmarksList(landmarks))
            results.multi_handedness.append(
                FakeClassificationList(handedness_label, 0.9)
            )

        except Exception:
            continue

    return results

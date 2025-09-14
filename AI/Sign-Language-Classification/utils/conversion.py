# utils/conversion.py
def convert_to_mp_face_results(face_landmarks):
    """Chuyển landmarks từ client thành MediaPipe Face Results"""
    class FakeFaceLandmarksList:
        def __init__(self, landmarks):
            self.landmark = landmarks
            
    class FakeFaceResults:
        def __init__(self, landmarks):
            self.multi_face_landmarks = [FakeFaceLandmarksList(landmarks)] if landmarks else []
            
    return FakeFaceResults(face_landmarks)

def convert_to_mp_hand_results(hand_landmarks_list):
    """Chuyển hand landmarks từ client thành MediaPipe Hand Results"""
    class FakeHandLandmarksList:
        def __init__(self, landmarks):
            self.landmark = landmarks
            
    class FakeHandResults:
        def __init__(self, hand_landmarks_list):
            self.multi_hand_landmarks = [FakeHandLandmarksList(hand.landmarks) for hand in hand_landmarks_list]
            self.multi_handedness = [{"classification": [{"label": hand.handedness}]} for hand in hand_landmarks_list]
            
    return FakeHandResults(hand_landmarks_list)
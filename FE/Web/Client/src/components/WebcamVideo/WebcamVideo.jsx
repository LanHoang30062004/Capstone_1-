import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Button, Space } from "antd";
import "./WebcamVideo.scss";
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { HandLandmarker, FaceLandmarker, FilesetResolver, DrawingUtils } =
  vision;

const WebcamVideo = ({ word, setAccuracy, setPredicWord }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [capturing, setCapturing] = useState(false);

  const handRef = useRef([]);
  const faceRef = useRef([]);

  useEffect(() => {
    const initModels = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      const handLm = await HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      const faceLm = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        outputFaceBlendshapes: false,
        numFaces: 1,
      });

      setHandLandmarker(handLm);
      setFaceLandmarker(faceLm);
    };

    initModels();
  }, []);

  useEffect(() => {
    let lastVideoTime = -1;
    let animationId;

    const predictWebcam = async () => {
      if (
        !webcamRef.current ||
        !webcamRef.current.video ||
        !handLandmarker ||
        !faceLandmarker
      ) {
        animationId = requestAnimationFrame(predictWebcam);
        return;
      }

      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const drawingUtils = new DrawingUtils(ctx);

      if (
        video.videoWidth === 0 ||
        video.videoHeight === 0 ||
        video.readyState < 2
      ) {
        animationId = requestAnimationFrame(predictWebcam);
        return;
      }

      if (video.currentTime === lastVideoTime) {
        animationId = requestAnimationFrame(predictWebcam);
        return;
      }
      lastVideoTime = video.currentTime;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const timestamp = performance.now();
      const handResult = handLandmarker.detectForVideo(video, timestamp);
      const faceResult = faceLandmarker.detectForVideo(video, timestamp);

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /** ---------------- HANDS ---------------- */
      if (handResult.landmarks && handResult.landmarks.length > 0) {
        const hands = [];
        for (let i = 0; i < handResult.landmarks.length; i++) {
          const landmarks = handResult.landmarks[i];

          // ⭐ Draw connections
          drawingUtils.drawConnectors(
            landmarks,
            HandLandmarker.HAND_CONNECTIONS,
            {
              color: "#ff0000",
              lineWidth: 2,
            }
          );

          // ⭐ Draw landmarks
          drawingUtils.drawLandmarks(landmarks, {
            color: "#00ff00",
            lineWidth: 2,
          });

          hands.push({
            handedness: handResult.handednesses[i][0].categoryName,
            landmarks,
          });
        }
        handRef.current = hands;
      } else {
        handRef.current = [];
      }

      /** ---------------- FACE ---------------- */
      if (faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0) {
        const points = faceResult.faceLandmarks[0];

        drawingUtils.drawConnectors(
          points,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: "#ffffff60", lineWidth: 1 }
        );

        drawingUtils.drawConnectors(
          points,
          FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
          { color: "#00ff00", lineWidth: 1 }
        );

        drawingUtils.drawConnectors(
          points,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          { color: "#ff0000", lineWidth: 2 }
        );

        faceRef.current = points;
      } else {
        faceRef.current = [];
      }

      ctx.restore();
      animationId = requestAnimationFrame(predictWebcam);
    };

    animationId = requestAnimationFrame(predictWebcam);
    return () => cancelAnimationFrame(animationId);
  }, [handLandmarker, faceLandmarker]);

  const startCapture = () => {
    if (!webcamRef.current) return;
    setCapturing(true);

    setTimeout(async () => {
      setCapturing(false);

      // Lấy video dimensions để normalize
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // ⭐ FIX: Chuẩn bị payload theo đúng format BE mong đợi
      const payload = {
        word: word || "",
        face_landmarks: [], // ⭐ QUAN TRỌNG: BE mới chỉ dùng 2 features mean
        hand_landmarks: (handRef.current || []).map((h) => ({
          handedness: h.handedness, // ⭐ QUAN TRỌNG: Phải có handedness
          landmarks: (h.landmarks || []).slice(0, 21).map((lm) => ({
            x: lm.x, // Đã normalized [0,1] từ MediaPipe
            y: lm.y,
          })),
        })),
      };

      console.log("Payload gửi đến BE:", {
        word: payload.word,
        face_landmarks_count: payload.face_landmarks.length,
        hand_landmarks_count: payload.hand_landmarks.length,
        sample_hand_landmark: payload.hand_landmarks[0]?.landmarks[0],
      });

      console.log("✅ IMPROVED Payload:", {
        word: payload.word,
        hand_landmarks_count: payload.hand_landmarks.length,
        handedness: payload.hand_landmarks.map((h) => h.handedness),
        landmarks_per_hand: payload.hand_landmarks[0]?.landmarks?.length || 0,
      });
      console.log(payload);

      try {
        const res = await axios.post(
          "http://localhost:8000/predict-improved",
          payload
        );
        setAccuracy(res.data.confidence);
        setPredicWord(res.data.predicted_word);
        console.log("✅ Kết quả từ BE:", res.data);
      } catch (err) {
        console.error("❌ Lỗi khi gửi request:", err);
      }
    }, 5000);
  };

  return (
    <div className="webcam">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div style={{ position: "relative" }}>
          <Webcam
            ref={webcamRef}
            mirrored={true}
            videoConstraints={{ facingMode: "user" }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              transform: "scaleX(-1)",
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              // display: "h",
            }}
          />
        </div>

        <Button
          type="primary"
          onClick={startCapture}
          disabled={!handLandmarker || !faceLandmarker || capturing}
          block
          size="large"
        >
          {capturing ? "Đang quay..." : "Quay & Predict"}
        </Button>
      </Space>
    </div>
  );
};

export default WebcamVideo;

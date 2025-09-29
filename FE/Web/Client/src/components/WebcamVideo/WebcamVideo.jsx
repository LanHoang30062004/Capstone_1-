import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Button, Space } from "antd";
import "./WebcamVideo.scss";
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { HandLandmarker, FaceLandmarker, FilesetResolver, DrawingUtils } =
  vision;

const WebcamVideo = ({ word, setAccuracy }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [capturing, setCapturing] = useState(false);

  // Lưu landmark mới nhất (không bị delay như state)
  const handRef = useRef([]);
  const faceRef = useRef([]);

  // Load model khi component mount
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

  // Hàm loop predict realtime
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

      if (video.currentTime === lastVideoTime) {
        animationId = requestAnimationFrame(predictWebcam);
        return;
      }
      lastVideoTime = video.currentTime;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const startTimeMs = performance.now();
      const handResult = handLandmarker.detectForVideo(video, startTimeMs);
      const faceResult = faceLandmarker.detectForVideo(video, startTimeMs);

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw hands
      if (handResult.landmarks && handResult.landmarks.length > 0) {
        const hands = [];
        for (let i = 0; i < handResult.landmarks.length; i++) {
          const landmarks = handResult.landmarks[i];
          const handedness = handResult.handednesses[i][0].categoryName;

          drawingUtils.drawConnectors(landmarks, vision.HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 3,
          });
          drawingUtils.drawLandmarks(landmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });

          hands.push({ handedness, landmarks });
        }

        handRef.current = hands;
      } else {
        handRef.current = [];
      }

      // Draw face
      if (faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0) {
        const firstFace = faceResult.faceLandmarks[0];
        drawingUtils.drawConnectors(
          firstFace,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: "#C0C0C070", lineWidth: 1 }
        );
        drawingUtils.drawConnectors(
          firstFace,
          FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
          { color: "#E0E0E0" }
        );
        drawingUtils.drawConnectors(
          firstFace,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          { color: "#FF3030" }
        );

        faceRef.current = firstFace;
      } else {
        faceRef.current = [];
      }

      ctx.restore();
      animationId = requestAnimationFrame(predictWebcam);
    };

    animationId = requestAnimationFrame(predictWebcam);
    return () => cancelAnimationFrame(animationId);
  }, [handLandmarker, faceLandmarker]);

  // Hàm quay và gửi sau 5s
  const startCapture = () => {
    if (!webcamRef.current) return;
    setCapturing(true);

    setTimeout(async () => {
      setCapturing(false);

      const payload = {
        word: word || "",
        face_landmarks: (faceRef.current || []).map((lm) => ({
          x: lm.x,
          y: lm.y,
          z: lm.z || 0.0,
        })),
        hand_landmarks: (handRef.current || []).map((h) => ({
          handedness: h.handedness,
          landmarks: h.landmarks.map((lm) => ({
            x: lm.x,
            y: lm.y,
            z: lm.z || 0.0,
          })),
        })),
      };

      try {
        const res = await axios.post("http://localhost:8000/predict", payload);
        setAccuracy(res.data.accuracy);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
      }
    }, 5000);
  };

  return (
    <div className="webcam">
      <Space direction="vertical">
        <div className="webcam__camera">
          <Webcam
            ref={webcamRef}
            style={{
              position: "relative",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              height: "auto",
              width: "100%",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 10,
              height: "auto",
              width: "100%",
            }}
          />
        </div>
        <Button
          type="primary"
          onClick={startCapture}
          disabled={capturing}
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

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Button, Space } from "antd";
import "./WebcamVideo.scss";
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { HandLandmarker, FaceLandmarker, FilesetResolver, DrawingUtils } =
  vision;

const WebcamVideo = ({ word, setAccuracy, setPredicWord }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [faceCount, setFaceCount] = useState(0);

  const handRef = useRef([]);
  const faceRef = useRef([]);
  const faceResultsRef = useRef(null); // THÊM: Lưu toàn bộ face results

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
        numFaces: 2, // THAY ĐỔI: Cho phép phát hiện tối đa 2 mặt
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

      // THÊM: Cập nhật số lượng mặt phát hiện
      const currentFaceCount = faceResult.faceLandmarks
        ? faceResult.faceLandmarks.length
        : 0;
      setFaceCount(currentFaceCount);
      faceResultsRef.current = faceResult; // Lưu lại để sử dụng trong startCapture

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /** ---------------- HANDS ---------------- */
      if (handResult.landmarks && handResult.landmarks.length > 0) {
        const hands = [];
        for (let i = 0; i < handResult.landmarks.length; i++) {
          const landmarks = handResult.landmarks[i];

          // Draw connections
          drawingUtils.drawConnectors(
            landmarks,
            HandLandmarker.HAND_CONNECTIONS,
            {
              color: "#ff0000",
              lineWidth: 2,
            }
          );

          // Draw landmarks
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
        faceRef.current = faceResult.faceLandmarks[0]; // chỉ lưu để predict
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

    // THÊM: Kiểm tra số lượng mặt trước khi quay
    if (faceCount > 1) {
      toast.warning(
        `Phát hiện ${faceCount} mặt trong khung hình! Hãy đảm bảo chỉ có 1 mặt để kết quả chính xác.`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return; // DỪNG LẠI nếu có nhiều hơn 1 mặt
    }

    if (faceCount === 0) {
      toast.error("Không phát hiện mặt nào! Hãy điều chỉnh vị trí.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setCapturing(true);

    // ⭐ THÊM: Toast thông báo bắt đầu quay
    toast.info("📸 Đang quay video trong 5 giây...", {
      position: "top-right",
      autoClose: 3000,
    });

    setTimeout(async () => {
      setCapturing(false);

      const video = webcamRef.current.video;

      // THÊM DEBUG CHI TIẾT
      console.log("🔍 DEBUG FACE LANDMARKS:");
      console.log(
        `   Số lượng face landmarks: ${faceRef.current?.length || 0}`
      );
      console.log(
        `   Số lượng hand landmarks: ${handRef.current?.length || 0}`
      );
      console.log(`   Số lượng mặt phát hiện: ${faceCount}`);

      if (faceRef.current && faceRef.current.length > 0) {
        console.log(`   Face landmark đầu tiên:`, faceRef.current[0]);
      }

      // ⭐ FIX: THÊM FACE LANDMARKS
      const payload = {
        word: word || "",
        face_landmarks: (faceRef.current || []).slice(0, 468).map((lm) => ({
          x: lm.x,
          y: lm.y,
        })),
        hand_landmarks: (handRef.current || []).map((h) => ({
          handedness: h.handedness,
          landmarks: (h.landmarks || []).slice(0, 21).map((lm) => ({
            x: lm.x,
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

      console.log("FIXED Payload:", {
        word: payload.word,
        face_landmarks_count: payload.face_landmarks.length,
        hand_landmarks_count: payload.hand_landmarks.length,
        handedness: payload.hand_landmarks.map((h) => h.handedness),
      });

      try {
        const res = await axios.post(
          "http://localhost:8001/predict-improved",
          payload
        );
        setAccuracy(res.data.confidence);
        setPredicWord(res.data.predicted_word);

        console.log("Kết quả từ BE:", res.data);
      } catch (err) {
        console.error("Lỗi khi gửi request:", err);
        toast.error("Lỗi kết nối đến server!", {
          position: "top-right",
          autoClose: 3000,
        });
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
              // visibility: "hidden",
            }}
          />
        </div>

        <Button
          type="primary"
          onClick={startCapture}
          disabled={!handLandmarker || !faceLandmarker || capturing}
          block
          size="large"
          style={{
            backgroundColor: faceCount > 1 ? "#ff4d4f" : "#49BBBD",
          }}
        >
          {capturing ? "Đang quay..." : "Quay & Predict"}
        </Button>
      </Space>
    </div>
  );
};

export default WebcamVideo;

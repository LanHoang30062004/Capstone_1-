import { useEffect, useRef, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";

function Test1() {
  const videoRef = useRef(null);
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    if (!videoRef.current) return;

    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      refineFaceLandmarks: true, // Lấy chi tiết khuôn mặt
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults(async (results) => {
      // Gửi cả face + hand landmark sang backend
      try {
        const response = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            face_results: { multiFaceLandmarks: results.faceLandmarks },
            hand_results: {
              multiHandLandmarks: [
                results.leftHandLandmarks,
                results.rightHandLandmarks,
              ].filter(Boolean),
            },
          }),
        });

        const data = await response.json();
        setPrediction(data.prediction);
      } catch (err) {
        console.error("Error sending data:", err);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await holistic.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }, []);

  console.log(prediction);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: "640px" }} />
      <h2>Prediction: {prediction}</h2>
    </div>
  );
}

export default Test1;

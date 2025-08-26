import { Button, Space } from "antd";
import { useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamVideo = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState([]);

  const startRecording = () => {
    if (chunks.length > 0) setChunks([]);

    const stream = webcamRef.current.stream;
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setChunks((prev) => prev.concat(e.data));
        console.log("Chạy vào đây");
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      console.log(chunks);
    };

    mediaRecorderRef.current.start();

    // Tự động dừng sau 3 giây
    setTimeout(() => stopRecording(), 3000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="webcam">
      <Space direction="vertical">
        <Webcam
          height={"auto"}
          width={"100%"}
          audio={false}
          mirrored={true}
          ref={webcamRef}
        />

        <Button type="primary" onClick={startRecording} block size="large">
          Quay và phân tích
        </Button>
      </Space>
    </div>
  );
};

export default WebcamVideo;

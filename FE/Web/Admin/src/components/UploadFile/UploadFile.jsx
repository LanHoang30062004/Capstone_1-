import React from "react";
import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadFile = ({ setFileUrl }) => {
  const accessToken = localStorage.getItem("adminAccessToken");
  console.log(accessToken);
  const config = {
    name: "file",
    action: "http://localhost:8080/api/v1/word/upload",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status === "done") {
        setFileUrl(info.file.response.data);
        message.success(`${info.file.name} upload thành công.`);
      } else if (info.file.status === "error") {
        console.log(info.file.response);
        message.error(`${info.file.name} upload thất bại`);
      }
    },
  };

  return (
    <Upload {...config}>
      <Button icon={<UploadOutlined />}>Upload video</Button>
    </Upload>
  );
};

export default UploadFile;

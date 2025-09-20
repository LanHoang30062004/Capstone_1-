import React from "react";
import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadFileNotShow = ({ value, onChange }) => {
  const accessToken = localStorage.getItem("accessToken");

  const config = {
    name: "file",
    action: "http://localhost:8080/api/v1/word/upload",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status === "done") {
        const url = info.file.response.data; // giả sử API trả về { data: "fileUrl" }
        onChange?.(url); // cập nhật vào Form
        message.success(`${info.file.name} upload thành công.`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload thất bại.`);
      }
    },
  };

  return (
    <>
      {value ? (
        "Đã chọn file"
      ) : (
        <Upload {...config}>
          <Button icon={<UploadOutlined />}>Upload Video</Button>
        </Upload>
      )}
    </>
  );
};

export default UploadFileNotShow;

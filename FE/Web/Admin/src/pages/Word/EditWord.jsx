import { Button, Form, Input, Modal, Upload } from "antd";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LoadingContext } from "~/context/LoadingContext";
import UploadFile from "../../components/UploadFile/UploadFile";
import { fetchWordEdit } from "~/redux/word/wordSlice";
import { data } from "react-router-dom";

const EditWord = (props) => {
  const { open, setOpen, word } = props;
  const [fileUrl, setFileUrl] = useState("");
  const dispatch = useDispatch();
  const { loading, toggleLoading } = useContext(LoadingContext);
  const [form] = Form.useForm();

  const handleEdit = (value) => {
    if (fileUrl) value.videoUrl = fileUrl;
    else value.videoUrl = word.videoUrl;

    const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
    value.userId = userInfo.id;

    try {
      toggleLoading(true);
      toast.promise(dispatch(fetchWordEdit({ id: word.wordId, data: value })), {
        pending: "Đang chỉnh sửa...",
      });
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Chỉnh sửa kí hiệu</h4>}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Huỷ
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={() => form.submit()}
            loading={loading}
          >
            Chỉnh sửa
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleEdit}
          layout="vertical"
          initialValues={word}
        >
          <Form.Item label="Upload video">
            <UploadFile setFileUrl={setFileUrl} />
          </Form.Item>

          {word.videoUrl && <video src={word.videoUrl} controls width={150} />}

          <Form.Item
            name="wordName"
            label="Tên kí hiệu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên kí hiệu",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="wordMeaning"
            label="Nghĩa kí hiệu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập nghĩa kí hiệu",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditWord;

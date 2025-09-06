import { Button, Form, Input, Modal, Upload } from "antd";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LoadingContext } from "~/context/LoadingContext";
import UploadFile from "../../components/UploadFile/UploadFile";
import { fetchFlashCardAdd } from "~/redux/flashCard/flashCardSlice";

const AddFlashCard = (props) => {
  const { open, setOpen } = props;
  const [fileUrl, setFileUrl] = useState("");
  const dispatch = useDispatch();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const [form] = Form.useForm();

  const handleAdd = async (value) => {
    if (!fileUrl) {
      toast.error("Vui lòng upload video!");
      return;
    }

    value.cards.videoUrl = fileUrl;

    console.log(value);

    try {
      toggleLoading(true);
      const response = await dispatch(fetchFlashCardAdd(value)).unwrap();

      toast.success("Thêm thành công!");
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Thêm kí hiệu</h4>}
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
            Thêm
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item label="Upload video">
            <UploadFile setFileUrl={setFileUrl} />
          </Form.Item>

          <Form.Item
            name={["cards", "result"]}
            label="Kết quả"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập kết quả",
              },
            ]}
          >
            <Input.TextArea
              placeholder={`[
    {
      "result": "string",
      "videoUrl": "string"
    },
    {
      "result": "string",
      "videoUrl": "string"
    }
  ]`}
              rows={8}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập nội dung",
              },
            ]}
          >
            <Input.TextArea rows={4} maxLength={255} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddFlashCard;

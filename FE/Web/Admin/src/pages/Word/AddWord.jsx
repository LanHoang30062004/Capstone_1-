import { Button, Form, Input, Modal, Upload } from "antd";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LoadingContext } from "~/context/LoadingContext";
import UploadFile from "../../components/UploadFile/UploadFile";
import { fetchWordAdd } from "~/redux/word/wordSlice";

const AddWord = (props) => {
  const { open, setOpen } = props;
  const [fileUrl, setFileUrl] = useState("");
  const dispatch = useDispatch();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const [form] = Form.useForm();

  const handleAdd = (value) => {
    if (!fileUrl) {
      toast.error("Vui lòng upload video!");
      return;
    }

    value.videoUrl = fileUrl;
    const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
    value.userId = userInfo.id;

    try {
      toggleLoading(true);
      toast.promise(dispatch(fetchWordAdd(value)), {
        pending: "Đang thêm...",
      });

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
            name="wordID"
            label="Mã kí hiệu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã kí hiệu",
              },

              {
                pattern: /^\d+$/,
                message: "Mã kí hiệu chỉ được chứa số!",
              },
            ]}
          >
            <Input />
          </Form.Item>

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

export default AddWord;

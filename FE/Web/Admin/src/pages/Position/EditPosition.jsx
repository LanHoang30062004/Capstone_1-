import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LoadingContext } from "~/context/LoadingContext";
// import { fetchPositionUpdateApi } from "~/redux/position/positionSlice";

const EditPosition = (props) => {
  const { open, setOpen, position } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleEdit = (value) => {
    try {
      toggleLoading(true);
      toast.promise(
        // dispatch(
        //   fetchPositionUpdateApi({
        //     id: position.positionID,
        //     data: value,
        //   })
        // ),
        {
          pending: "Đang cập nhật...",
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Chỉnh sửa vị trí</h4>}
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
          initialValues={position}
        >
          <Form.Item
            name="positionName"
            label="Tên vị trí"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên vị trí",
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

export default EditPosition;

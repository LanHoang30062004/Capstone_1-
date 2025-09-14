import { Button, Form, Input, Modal, Space } from "antd";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoadingContext } from "~/context/LoadingContext";
import { CloseOutlined } from "@ant-design/icons";
import {
  fetchFlashCardDetail,
  fetchFlashCardEdit,
} from "~/redux/flashCard/flashCardSlice";

const EditFlashCard = (props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const [form] = Form.useForm();

  const flashCard = useSelector((state) => state.flashCard.flashCardDetail);

  const handleEdit = async (value) => {
    try {
      toggleLoading(true);

      await dispatch(fetchFlashCardEdit({ id: 1, data: value })).unwrap();

      await dispatch(fetchFlashCardDetail(flashCard.id));

      toast.success("Chỉnh sửa thành công!");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Chỉnh sửa Flash Card</h4>}
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
          initialValues={flashCard}
          layout="vertical"
        >
          <Form.Item label="FlashCard">
            <Form.List name="cards">
              {(subFields, subOpt) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 16,
                  }}
                >
                  {subFields.map((subField) => (
                    <Space key={subField.key}>
                      <Form.Item noStyle name={[subField.name, "result"]}>
                        <Input placeholder="Kí hiệu" />
                      </Form.Item>

                      <Form.Item
                        name={[subField.name, "videoUrl"]}
                        style={{ display: "none" }}
                      >
                        <Input />
                      </Form.Item>

                      <CloseOutlined
                        onClick={() => {
                          subOpt.remove(subField.name);
                        }}
                      />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => subOpt.add()} block>
                    + Thêm dòng
                  </Button>
                </div>
              )}
            </Form.List>
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

export default EditFlashCard;

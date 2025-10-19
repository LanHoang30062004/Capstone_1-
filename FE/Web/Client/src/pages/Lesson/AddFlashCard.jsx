import { Button, Form, Input, Modal, Space } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchFlashCardAdd } from "~/redux/flashCard/flashCardSlice";
import { CloseOutlined } from "@ant-design/icons";

const AddFlashCard = (props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  const [loading, toggleLoading] = useState(false);

  const [form] = Form.useForm();

  const handleAdd = async (value) => {
    try {
      toggleLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      value.userId = parseInt(userInfo.id);

      await dispatch(fetchFlashCardAdd(value)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Thêm flash card</h4>}
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

export default AddFlashCard;

import { Button, Flex, Form, Input, Modal, Space } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CloseOutlined } from "@ant-design/icons";
import {
  fetchFlashCardDetail,
  fetchFlashCardEdit,
} from "~/redux/flashCard/flashCardSlice";
import { useParams } from "react-router-dom";

const EditFlashCard = (props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  const [loading, toggleLoading] = useState();
  const { id } = useParams();

  const [form] = Form.useForm();

  const flashCard = useSelector((state) => state.flashCard.flashCardDetail);

  const handleEdit = async (value) => {
    try {
      toggleLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      value.userId = parseInt(userInfo.id);
      if (value?.cards.length < 1)
        return toast.error("Vui lòng thêm ít nhất 1 từ");
      await dispatch(fetchFlashCardEdit({ id: id, data: value })).unwrap();

      await dispatch(fetchFlashCardDetail(flashCard.id));
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
                    <Flex align="center" key={subField.key} gap={10}>
                      <Form.Item
                        name={[subField.name, "result"]}
                        rules={[
                          {
                            transform: (value) => value?.trim(),
                          },
                          {
                            required: true,
                            message: "Không được để trống từ",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Input placeholder="Kí hiệu" />
                      </Form.Item>

                      <Form.Item
                        name={[subField.name, "videoUrl"]}
                        style={{ display: "none" }}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item>
                        <CloseOutlined
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                        />
                      </Form.Item>
                    </Flex>
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

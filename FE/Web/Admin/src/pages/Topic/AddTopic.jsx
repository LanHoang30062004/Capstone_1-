import { Form, Input, InputNumber, Button, Space, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Header from "~/components/Header/Header";
import { useContext } from "react";
import { LoadingContext } from "~/context/LoadingContext";
import { useDispatch } from "react-redux";
import { fetchTopicAdd } from "~/redux/topic/topicSlice";
import { toast } from "react-toastify";

const AddTopic = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleFinish = async (value) => {
    try {
      toggleLoading(true);
      console.log(value);
      toast.promise(dispatch(fetchTopicAdd(value)).unwrap());
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <>
      <div className="word__list contain">
        <Header title="Chủ đề" subTitle="Danh sách chủ đề" />

        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          initialValues={{
            durationMinutes: 0,
            numberOfQuestion: 0,
          }}
        >
          <Form.Item
            name="content"
            label="Tên chủ đề"
            rules={[{ required: true, message: "Vui lòng nhập tên chủ đề" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="durationMinutes"
            label="Thời gian (phút)"
            rules={[{ required: true, message: "Vui lòng nhập thời gian" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="numberOfQuestion"
            label="Số lượng câu hỏi"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng câu hỏi" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {/* Form.List cho questions */}
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    direction="vertical"
                    style={{
                      display: "flex",
                      marginBottom: 24,
                      border: "1px solid #eee",
                      padding: 16,
                    }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "questionUrl"]}
                      label="Question URL"
                      className="none"
                    >
                      <Input />
                    </Form.Item>

                    {/* Form.List cho options */}
                    <Form.List name={[name, "options"]}>
                      {(
                        optionFields,
                        { add: addOption, remove: removeOption }
                      ) => (
                        <>
                          {optionFields.map(
                            ({ key: optKey, name: optName, ...optRest }) => (
                              <Space
                                key={optKey}
                                style={{ display: "flex", marginBottom: 8 }}
                                align="baseline"
                              >
                                <Form.Item
                                  {...optRest}
                                  name={[optName, "option"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn đáp án",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Option" />
                                </Form.Item>
                                <Form.Item
                                  {...optRest}
                                  name={[optName, "correct"]}
                                  valuePropName="checked"
                                  initialValue={false}
                                >
                                  <Checkbox>Đáp án đúng</Checkbox>
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => removeOption(optName)}
                                />
                              </Space>
                            )
                          )}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addOption()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Thêm lựa chọn
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Button type="dashed" danger onClick={() => remove(name)}>
                      Xoá câu hỏi
                    </Button>
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm câu hỏi
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddTopic;

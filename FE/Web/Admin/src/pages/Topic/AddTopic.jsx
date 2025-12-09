import { Form, Input, InputNumber, Button, Space, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Header from "~/components/Header/Header";
import { useContext } from "react";
import { LoadingContext } from "~/context/LoadingContext";
import { useDispatch } from "react-redux";
import { fetchTopicAdd } from "~/redux/topic/topicSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddTopic = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const questions = Form.useWatch("questions", form); // 👈 theo dõi số câu hỏi
  const numberOfQuestion = questions ? questions.length : 0;

  const handleFinish = async (value) => {
    try {
      toggleLoading(true);
      const payload = {
        ...value,
        numberOfQuestion: numberOfQuestion,
      };

      toast.promise(dispatch(fetchTopicAdd(payload)).unwrap());
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <div className="word__list contain">
      <Header title="Bài test" subTitle="Thêm bài test" />

      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          durationMinutes: 0,
        }}
      >
        <Form.Item
          name="content"
          label="Tên bài test"
          rules={[{ required: true, message: "Vui lòng nhập tên bài test" }]}
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

        <Form.Item label="Số lượng câu hỏi">
          <InputNumber
            value={numberOfQuestion}
            disabled
            style={{ width: "100%" }}
          />
        </Form.Item>

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
                                    message: "Vui lòng nhập đáp án",
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

        <Space>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm bài test
            </Button>
          </Form.Item>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/topic")}
          >
            Quay lại
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default AddTopic;

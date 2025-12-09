import { Form, Input, InputNumber, Button, Space, Checkbox, Flex } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Header from "~/components/Header/Header";
import { useContext, useEffect } from "react";
import { LoadingContext } from "~/context/LoadingContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopicDetail, fetchTopicEdit } from "~/redux/topic/topicSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditTopic = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const topic = useSelector((state) => state.topic.topicDetail);
  const { loading, toggleLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const questions = Form.useWatch("questions", form);
  const numberOfQuestion = questions ? questions.length : 0;

  const handleFinish = async (value) => {
    try {
      toggleLoading(true);
      const payload = {
        ...value,
        id: id,
        numberOfQuestion: numberOfQuestion,
      };

      toast.promise(dispatch(fetchTopicEdit(payload)).unwrap());
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  useEffect(() => {
    () => {
      dispatch(fetchTopicDetail(id));
    };
  }, [id, dispatch]);

  return (
    <div className="topic__list contain">
      <Header title="Bài test" subTitle="Chỉnh sửa bài test" />

      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={topic}
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
              Chỉnh sửa
            </Button>
          </Form.Item>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/topic/${id}`)}
          >
            Quay lại
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default EditTopic;

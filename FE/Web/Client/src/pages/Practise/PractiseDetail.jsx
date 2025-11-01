import { Button, Card, Flex, Form, Select, Tag } from "antd";
import { useEffect, useState } from "react";
import { MdAccessTime } from "react-icons/md";
import { MdOutlineQuiz } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import * as topicService from "~/service/topicService";

const options = Array.from({ length: 12 }, (_, i) => {
  const value = (i + 1) * 5;
  return {
    value: value,
    label: `${value} phút`,
  };
});

const PractiseDetail = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (value) => {
    navigate(`/test/${id}?time_limit=${value.time}`);
    localStorage.setItem("time_limit", Date.now() + value.time * 60 * 1000);
  };

  useEffect(() => {
    const fetchDetailTopic = async () => {
      const response = await topicService.getDetailTopic(id);

      setTopic(response);
    };

    fetchDetailTopic();
  }, []);

  console.log(topic);

  return (
    <>
      <section className="practise-detail mt">
        <div className="container">
          <div className="practise-detail__inner">
            <Card className="practise-detail__card">
              <Flex vertical gap={20}>
                <h2 className="practise-detail__title">Động vật</h2>

                <div className="practise-detail__btn btn">
                  Thông tin bài luyện
                </div>

                <div className="practise-detail__info">
                  <div className="practise-detail__info">
                    <MdAccessTime className="practise-detail__info--icon" />{" "}
                    {/* Thời gian làm bài: {topic?.durationMinutes} phút |{" "} */}
                    Số lượng câu hỏi:
                    3 câu hỏi
                    {/* {topic?.numberOfQuestion} câu hỏi */}
                  </div>
                </div>

                <Form onFinish={handleSubmit}>
                  <Form.Item name="time" initialValue={5}>
                    <Select className="full-width" options={options} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Luyện tập
                    </Button>
                  </Form.Item>
                </Form>
              </Flex>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default PractiseDetail;

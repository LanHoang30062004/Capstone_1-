import { Button, Card, Col, Flex, Radio, Row } from "antd";
import Background from "~/assets/images/Bg1.png";
import Timer from "~/components/Timer/Timer";
import "./Test.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as topicService from "~/service/topicService";

const style = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const Test = () => {
  const answersLocal = JSON.parse(localStorage.getItem("answers"));
  const [answers, setAnswers] = useState(answersLocal ? answersLocal : {});
  const [topic, setTopic] = useState(null);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSelect = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };

    setAnswers(newAnswers);
    console.log(newAnswers);
    localStorage.setItem("answers", JSON.stringify(newAnswers));
  };

  const hanldeRedirect = (index) => {
    const question = document.getElementById(`question-${index}`);
    console.log(question);
    question.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const fetchDetailTopic = async () => {
      const response = await topicService.getDetailTopic(id);

      setTopic(response);
    };

    fetchDetailTopic();

    return () => {
      const timeLocal =
        parseInt(localStorage.getItem("time_limit")) - Date.now();
      if (timeLocal < 0) {
        localStorage.removeItem("answers");
        localStorage.removeItem("time_limit");
      }
    };
  }, [id]);

  return (
    <>
      <div className="test mt">
        <div className="container">
          <div className="test__inner">
            <div className="test__head">
              <h2 className="test__title">{topic?.content}</h2>
              <Button type="primary">Thoát</Button>
            </div>

            <Row gutter={[30, 30]}>
              <Col lg={18} md={16} sm={24} xs={24}>
                <div className="test__left">
                  <Card>
                    {topic?.questions?.length > 0 &&
                      topic.questions.map((item, index) => (
                        <div
                          className="test__question"
                          id={`question-${index + 1}`}
                          key={index}
                        >
                          <div className="test__question--number">
                            {index + 1}
                          </div>

                          <div className="test__question--video">
                            <video src={item.questionUrl} autoPlay loop />
                          </div>

                          <Radio.Group
                            style={style}
                            onChange={(e) =>
                              handleSelect(index + 1, e.target.value)
                            }
                            value={answers[index + 1]}
                          >
                            {item.options.map((option) => (
                              <Radio key={option.option} value={option.option}>
                                {option.option}
                              </Radio>
                            ))}
                          </Radio.Group>
                        </div>
                      ))}
                  </Card>
                </div>
              </Col>

              <Col lg={6} md={8} sm={24} xs={24}>
                <Card className="test__navigator">
                  <div className="test__navigator--title">
                    Thời gian làm bài
                  </div>

                  <div className="test__navigator--timer">
                    <Timer duration={10 * 60 * 1000} type="down" />
                  </div>

                  <Button
                    className="test__navigator--submit full-width"
                    type="primary"
                    size="large"
                  >
                    Nộp bài
                  </Button>

                  <Flex wrap={true} align="center">
                    {topic?.questions?.length > 0 &&
                      topic?.questions?.map((item, index) => (
                        <div
                          className={
                            "test__navigator--question" +
                            (answers[index + 1] ? " active" : "")
                          }
                          onClick={() => hanldeRedirect(index + 1)}
                        >
                          {index + 1}
                        </div>
                      ))}
                  </Flex>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;

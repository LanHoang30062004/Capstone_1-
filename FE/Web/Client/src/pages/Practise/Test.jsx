import { Button, Card, Col, Flex, Radio, Row, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Timer from "~/components/Timer/Timer";
import "./Test.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!topic?.questions) return;

    setLoadingSubmit(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    const details = topic.questions.map((q, index) => {
      const userAnswer = answers[index + 1];
      const correctOption = q.options.find((opt) => opt.correct)?.option;

      let isCorrect = false;
      if (!userAnswer) {
        skippedCount++;
      } else if (userAnswer === correctOption) {
        correctCount++;
        isCorrect = true;
      } else {
        wrongCount++;
      }

      return {
        questionIndex: index + 1,
        userAnswer: userAnswer || null,
        correctAnswer: correctOption,
        isCorrect,
      };
    });

    const totalQuestions = topic.questions.length;
    const accuracy = ((correctCount / totalQuestions) * 100).toFixed(1);

    const result = {
      topicId: topic.id,
      topicName: topic.content,
      totalQuestions,
      correctCount,
      wrongCount,
      skippedCount,
      accuracy,
      createdAt: new Date().toISOString(),
      details,
    };

    localStorage.setItem("test_result", JSON.stringify(result));
    localStorage.removeItem("answers");
    localStorage.removeItem("time_limit");

    navigate(`/test-result/${topic.id}`);

    setLoadingSubmit(false);
  };

  const handleConfirmSubmit = () => {
    Modal.confirm({
      title: "Xác nhận nộp bài",
      icon: <ExclamationCircleOutlined />,
      content:
        "Bạn có chắc chắn muốn nộp bài không? Vui lòng kiểm tra kĩ có câu nào chưa đánh. Sau khi nộp sẽ không thể thay đổi đáp án.",
      okText: "Nộp bài",
      cancelText: "Hủy",
      okType: "primary",
      onOk: () => handleSubmit(),
    });
  };

  const handleSelect = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    localStorage.setItem("answers", JSON.stringify(newAnswers));
  };

  const hanldeRedirect = (index) => {
    const question = document.getElementById(`question-${index}`);
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
      if (timeLocal <= 0) {
        localStorage.removeItem("answers");
        localStorage.removeItem("time_limit");
      }
    };
  }, [id]);

  return (
    <div className="test mt">
      <div className="container">
        <div className="test__inner">
          <div className="test__head">
            <h2 className="test__title">{topic?.content}</h2>
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
                <div className="test__navigator--title">Thời gian làm bài</div>

                <div className="test__navigator--timer">
                  <Timer
                    duration={2 * 1000}
                    type="down"
                    submit={handleSubmit}
                  />
                </div>

                <Button
                  className="test__navigator--submit full-width"
                  type="primary"
                  size="large"
                  loading={loadingSubmit}
                  onClick={handleConfirmSubmit}
                >
                  {loadingSubmit ? "Đang nộp bài..." : "Nộp bài"}
                </Button>

                <Flex wrap={true} align="center">
                  {topic?.questions?.length > 0 &&
                    topic?.questions?.map((item, index) => (
                      <div
                        key={index}
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
  );
};

export default Test;

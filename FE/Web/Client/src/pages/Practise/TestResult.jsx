import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Button, Divider } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import * as topicService from "~/service/topicService";
import "./TestResult.scss";

const TestResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const storedResult = JSON.parse(localStorage.getItem("test_result"));
    setResult(storedResult);

    const fetchDetailTopic = async () => {
      try {
        const response = await topicService.getDetailTopic(id);
        setTopic(response);
      } catch (error) {
        console.error("Error fetching topic:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailTopic();
  }, [id]);

  if (loading)
    return <Spin size="large" className="loading-spinner" tip="Đang tải..." />;
  if (!topic || !result) return <p>Không tìm thấy dữ liệu đề thi</p>;

  return (
    <div className="test-result-container container">
      <div className="result-header">
        <h1 className="result-title">Kết quả thi: {topic.content}</h1>

        <div className="header-buttons">
          <Button onClick={() => navigate("/practise")}>
            Quay về trang đề thi
          </Button>
        </div>
      </div>

      <div className="result-summary">
        <div className="summary-left">
          <p className="summary-item">
            <span className="label">Kết quả làm bài</span>
            <span className="value">
              {result.correctCount + result.wrongCount}/{result.totalQuestions}
            </span>
          </p>

          <p className="summary-item">
            <span className="label">Độ chính xác</span>
            <span className="value">{result.accuracy}%</span>
          </p>
        </div>

        <div className="summary-right">
          <Card className="summary-box correct-box">
            <CheckCircleOutlined className="icon" />
            <div>
              <p className="count">{result.correctCount}</p>
              <p>Trả lời đúng</p>
            </div>
          </Card>

          <Card className="summary-box wrong-box">
            <CloseCircleOutlined className="icon" />
            <div>
              <p className="count">{result.wrongCount}</p>
              <p>Trả lời sai</p>
            </div>
          </Card>

          <Card className="summary-box skipped-box">
            <MinusCircleOutlined className="icon" />
            <div>
              <p className="count">{result.skippedCount}</p>
              <p>Bỏ qua</p>
            </div>
          </Card>
        </div>
      </div>

      <Divider />

      {/* ==== DANH SÁCH CÂU HỎI ==== */}
      <div className="question-list">
        {topic.questions.map((q, index) => {
          const detail = result.details.find(
            (d) => d.questionIndex === index + 1
          );

          const userAnswer = detail?.userAnswer;
          const correctAnswer = detail?.correctAnswer;
          const isCorrect = detail?.isCorrect;

          return (
            <Card key={index} className="question-card">
              <div className="question-header">
                <span className="question-number">{index + 1}.</span>
                {q.questionUrl && (
                  <video
                    className="question-video"
                    src={q.questionUrl}
                    controls
                    width="280"
                  />
                )}
              </div>

              <div className="options">
                {q.options.map((opt, i) => {
                  const isThisUserAnswer = opt.option === userAnswer;
                  const isThisCorrect = opt.option === correctAnswer;

                  return (
                    <div
                      key={i}
                      className={`option-item ${
                        isThisCorrect && isThisUserAnswer
                          ? "correct"
                          : isThisUserAnswer && !isThisCorrect
                          ? "wrong"
                          : isThisCorrect && !isThisUserAnswer
                          ? "highlight-correct"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        checked={isThisUserAnswer}
                        disabled
                        readOnly
                      />
                      <span className="option-label">{opt.option}</span>
                      {isThisUserAnswer &&
                        (isCorrect ? (
                          <CheckOutlined className="icon correct-icon" />
                        ) : (
                          <CloseOutlined className="icon wrong-icon" />
                        ))}
                    </div>
                  );
                })}
              </div>

              {!isCorrect && (
                <p className="correct-answer">
                  Đáp án đúng: <span>{correctAnswer}</span>
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TestResult;

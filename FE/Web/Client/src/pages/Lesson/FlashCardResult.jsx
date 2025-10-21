import React from "react";
import { Button, Progress } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import "./FlashCardResult.scss";

const FlashCardResult = ({ onRetry, onNextLesson, onBack }) => {
  return (
    <div className="flashcard-result">
      <div className="flashcard-result__content">
        <div className="flashcard-result__progress">
          <div className="flashcard-result__circle">
            <CheckCircleOutlined className="flashcard-result__icon" />
          </div>

          <div className="flashcard-result__info">
            <h3>Tiến độ của bạn</h3>
            <div className="flashcard-result__bar">
              <span>Hoàn thành</span>
              <Progress
                percent={100}
                showInfo={false}
                strokeColor="#52c41a"
                trailColor="#e6f7e9"
              />
            </div>
          </div>

          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            className="flashcard-result__back"
          >
            Quay lại thẻ cuối cùng
          </Button>
        </div>

        {/* Bên phải: Bước tiếp theo */}
        <div className="flashcard-result__next">
          <h3>Bước tiếp theo</h3>

          <Button
            type="primary"
            size="large"
            className="flashcard-result__next-btn"
            onClick={onNextLesson}
          >
            Tiếp tục với flashcard khác
          </Button>

          <Button
            size="large"
            className="flashcard-result__retry-btn"
            onClick={onRetry}
          >
            Học lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashCardResult;

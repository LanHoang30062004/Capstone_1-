import React from "react";
import { Card, Button, Result } from "antd";
import {
  CheckCircleOutlined,
  ReloadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./FlashCardResult.scss";

const FlashCardResult = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const totalCards = location.state?.totalCards || 0;

  const handleRestart = () => {
    navigate(`/flashcard/${params.id}`);
  };

  const handleGoHome = () => {
    navigate("/lesson");
  };

  return (
    <div className="flashcard-result-container">
      <Card className="flashcard-result-card">
        <Result
          icon={<CheckCircleOutlined className="result-icon" />}
          title={<span className="result-title">Chúc mừng!</span>}
          subTitle={
            <div className="result-subtitle">
              <p>Bạn đã hoàn thành bài học với {totalCards} thẻ flashcard</p>
              <p>Hãy tiếp tục học tập để nâng cao kiến thức nhé </p>
            </div>
          }
          extra={[
            <Button
              key="restart"
              type="default"
              size="large"
              icon={<ReloadOutlined />}
              onClick={handleRestart}
              className="result-button"
            >
              Học lại
            </Button>,
            <Button
              key="home"
              type="primary"
              size="large"
              onClick={handleGoHome}
              className="result-button-primary"
            >
              Học tiếp
            </Button>,
          ]}
        />

        <div className="result-stats">
          <h3>Thống kê</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{totalCards}</div>
              <div className="stat-label">Tổng số thẻ</div>
            </div>
            <div className="stat-item">
              <div className="stat-value success">100%</div>
              <div className="stat-label">Hoàn thành</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FlashCardResult;

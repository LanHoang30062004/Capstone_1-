import React, { useEffect, useState } from "react";
import { Card, Button, Progress } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./FlashCard.scss";
import { useParams } from "react-router-dom";
import * as flashcardService from "~/service/flashcardService";

const FlashCard = () => {
  const [data, setData] = useState([]);

  const params = useParams();

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const nextCard = () => {
    if (index < data.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    }
  };

  const prevCard = () => {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
    }
  };

  useEffect(() => {
    const fetchDetailLesson = async () => {
      const response = await flashcardService.getDetailFlashCard(params.id);

      setData(response.cards);
    };

    fetchDetailLesson();
  }, []);

  console.log(data);

  return (
    <div className="flashcards">
      {/* Card */}
      <div
        className={`flashcards__card ${
          flipped ? "flashcards__card--flipped" : ""
        }`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flashcards__face flashcards__face--front">
          <Card>
            <video
              src={data[index]?.videoUrl}
              autoPlay
              loop
              style={{ width: "100%", height: "100%" }}
            ></video>
          </Card>
        </div>

        <div className="flashcards__face flashcards__face--back">
          <Card>{data[index]?.result}</Card>
        </div>
      </div>

      <div className="flashcards__controls">
        <Button
          shape="circle"
          icon={<LeftOutlined />}
          onClick={prevCard}
          disabled={index === 0}
        />
        <span className="flashcards__counter">
          {index + 1} / {data.length}
        </span>
        <Button shape="circle" icon={<RightOutlined />} onClick={nextCard} />
      </div>

      {/* Progress */}
      <Progress
        percent={(index / data.length) * 100}
        size="small"
        showInfo={false}
        className="flashcards__progress"
      />
    </div>
  );
};

export default FlashCard;

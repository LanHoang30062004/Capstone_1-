import { Button, Card, Flex, Modal, Progress } from "antd";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import "./LessonAnalyze.scss";
import WebcamVideo from "~/components/WebcamVideo/WebcamVideo";
import { useState } from "react";
const { Meta } = Card;

const LessonAnalyze = ({ lessonAnalyze, setLessonAnalyze, word }) => {
  const [accuracy, setAccuracy] = useState(0);
  const [predicWord, setPredicWord] = useState(null);

  return (
    <>
      <Modal
        className="lesson-analyze modal"
        open={lessonAnalyze}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setLessonAnalyze(false)}
            className="lesson-analyze__btn"
          >
            Đóng
          </Button>,
        ]}
        closable={false}
        width={700}
      >
        <div className="lesson-analyze__head">
          <h3 className="lesson-analyze__title">AI phân tích động tác</h3>
        </div>

        <div className="lesson-analyze__body">
          <div className="lesson-analyze__grid">
            <WebcamVideo
              setAccuracy={setAccuracy}
              word={word}
              setPredicWord={setPredicWord}
            />

            <div className="lesson-analyze__instruct">
              <div className="lesson-analyze__instruct--title">
                Hướng dẫn sử dụng
              </div>

              <div className="lesson-analyze__step">
                <div className="lesson-analyze__step--number">1</div>
                <p className="lesson-analyze__step--content">
                  Bấm quay và thực hiện động tác
                </p>
              </div>

              <div className="lesson-analyze__step">
                <div className="lesson-analyze__step--number">2</div>
                <p className="lesson-analyze__step--content">
                  AI sẽ phân tích và đưa ra phản hồi
                </p>
              </div>

              <Card className="lesson-analyze__card">
                <Meta
                  title={
                    <span className="lesson-analyze__title-text">
                      Kết quả phân tích
                    </span>
                  }
                />

                <div className="lesson-analyze__compare">
                  <Flex justify="space-between" align="center">
                    <p>Từ cần thực hiện:</p>
                    <strong className="lesson-analyze__word lesson-analyze__word--target">
                      {word}
                    </strong>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <p>Từ AI dự đoán:</p>
                    <Flex align="center" gap={6}>
                      {predicWord &&
                        (predicWord?.toUpperCase() === word?.toUpperCase() ? (
                          <AiOutlineCheckCircle className="lesson-analyze__icon lesson-analyze__icon--correct" />
                        ) : (
                          <AiOutlineCloseCircle className="lesson-analyze__icon lesson-analyze__icon--wrong" />
                        ))}
                      <strong
                        className={`lesson-analyze__word ${
                          predicWord?.toUpperCase() === word?.toUpperCase()
                            ? "lesson-analyze__word--correct"
                            : "lesson-analyze__word--wrong"
                        }`}
                      >
                        {predicWord || "—"}
                      </strong>
                    </Flex>
                  </Flex>
                </div>

                <div className="lesson-analyze__result">
                  <Flex align="center" justify="space-between">
                    <p>Độ chính xác</p>
                    <p>{(accuracy * 100).toFixed(1)}%</p>
                  </Flex>
                  <Progress percent={accuracy * 100} showInfo={false} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LessonAnalyze;

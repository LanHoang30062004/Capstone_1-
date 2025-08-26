import { Button, Card, Flex, Modal, Progress } from "antd";
import "./LessonAnalyze.scss";
import WebcamVideo from "~/components/WebcamVideo/WebcamVideo";
import UserPose from "~/components/WebcamVideo/UserPose";
const { Meta } = Card;

const LessonAnalyze = ({ lessonAnalyze, setLessonAnalyze }) => {
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
            {/* <WebcamVideo /> */}
            <UserPose />

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
                <Meta title="Kết quả phân tích" />

                <div className="lesson-analyze__result">
                  <Flex align="center" justify="space-between">
                    <p>Độ chính xác</p>
                    <p>80%</p>
                  </Flex>

                  <Progress percent={80} showInfo={false} />
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

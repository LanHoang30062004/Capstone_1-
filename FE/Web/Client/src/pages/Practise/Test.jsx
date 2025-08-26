import { Button, Card, Col, Flex, Radio, Row } from "antd";
import Background from "~/assets/images/Bg1.png";
import Timer from "~/components/Timer/Timer";
import "./Test.scss";
import { useState } from "react";

const options = Array.from({ length: 12 }, (_, i) => {
  return {
    number: i + 1,
    video: Background,
    options: [
      {
        value: 1,
        label: "B. Con chó",
      },

      {
        value: 2,
        label: "C. Con cừu",
      },

      {
        value: 3,
        label: "A. Con thỏ",
      },

      {
        value: 4,
        label: "D. Con lợn",
      },
    ],
  };
});

const style = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const Test = () => {
  const [answers, setAnswers] = useState({});
  console.log(answers);

  const handleSelect = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  return (
    <>
      <div className="test mt">
        <div className="container">
          <div className="test__inner">
            <div className="test__head">
              <h2 className="test__title">Động vật</h2>
              <Button type="primary">Thoát</Button>
            </div>

            <Row gutter={[30, 30]}>
              <Col lg={18} md={16} sm={24} xs={24}>
                <div className="test__left">
                  <Card>
                    {options.length > 0 &&
                      options.map((item) => (
                        <div className="test__question" key={item.number}>
                          <div className="test__question--number">
                            {item.number}
                          </div>

                          <div className="test__question--video">
                            <img src={item.video} alt="" />
                          </div>

                          <Radio.Group
                            style={style}
                            onChange={(e) =>
                              handleSelect(item.number, e.target.value)
                            }
                          >
                            {item.options.map((option) => (
                              <Radio key={option.value} value={option.value}>
                                {option.label}
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
                    {options.length > 0 &&
                      options.map((item) => (
                        <div
                          className={
                            "test__navigator--question" +
                            (answers[item.number] ? " active" : "")
                          }
                        >
                          {item.number}
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

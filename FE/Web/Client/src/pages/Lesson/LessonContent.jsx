import { Button, Form, Input, Pagination } from "antd";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
import Background from "~/assets/images/Bg2.png";
import LessonModal from "./LessonModal";
import LessonAnalyze from "./LessonAnalyze";

const LessonContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessonAnalyze, setLessonAnalyze] = useState(false);

  console.log(lessonAnalyze);

  const handleSearch = (value) => {
    console.log(value);
  };

  return (
    <>
      <section className="lesson-content mt">
        <div className="container">
          <div className="lesson-content__inner">
            <h1 className="lesson-content__title">
              Danh sách các bài học về đồ ăn
            </h1>

            <Form onFinish={handleSearch}>
              <Form.Item name="search">
                <Input
                  size="large"
                  placeholder="Tìm kiếm..."
                  prefix={<CiSearch />}
                  style={{ maxWidth: "500px" }}
                />
              </Form.Item>
            </Form>

            <div className="lesson-content__grid">
              <div className="lesson-content__card card">
                <div
                  className="lesson-content__card--video"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img src={Background} alt="Background" />

                  <div className="lesson-content__card--play">
                    <FaPlay className="lesson-content__card--icon" />
                  </div>
                </div>

                <div className="lesson-content__card--content">
                  <h3 className="lesson-content__card--title">Địa chỉ</h3>

                  <Button type="primary" onClick={() => setLessonAnalyze(true)}>
                    Phân tích
                  </Button>
                </div>
              </div>

              <div className="lesson-content__card card">
                <div className="lesson-content__card--video">
                  <img src={Background} alt="Background" />

                  <div className="lesson-content__card--play">
                    <FaPlay className="lesson-content__card--icon" />
                  </div>
                </div>

                <div className="lesson-content__card--content">
                  <h3 className="lesson-content__card--title">Địa chỉ</h3>

                  <Button type="primary">Phân tích</Button>
                </div>
              </div>

              <div className="lesson-content__card card">
                <div className="lesson-content__card--video">
                  <img src={Background} alt="Background" />

                  <div className="lesson-content__card--play">
                    <FaPlay className="lesson-content__card--icon" />
                  </div>
                </div>

                <div className="lesson-content__card--content">
                  <h3 className="lesson-content__card--title">Địa chỉ</h3>

                  <Button type="primary">Phân tích</Button>
                </div>
              </div>

              <div className="lesson-content__card card">
                <div className="lesson-content__card--video">
                  <img src={Background} alt="Background" />

                  <div className="lesson-content__card--play">
                    <FaPlay className="lesson-content__card--icon" />
                  </div>
                </div>

                <div className="lesson-content__card--content">
                  <h3 className="lesson-content__card--title">Địa chỉ</h3>

                  <Button type="primary">Phân tích</Button>
                </div>
              </div>
            </div>

            <Pagination
              className="lesson-content__pagination"
              align="center"
              defaultCurrent={1}
              total={50}
            />
          </div>

          <LessonModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />

          <LessonAnalyze
            lessonAnalyze={lessonAnalyze}
            setLessonAnalyze={setLessonAnalyze}
          />
        </div>
      </section>
    </>
  );
};

export default LessonContent;

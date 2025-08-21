import { Button, Card, Pagination } from "antd";
import FoodIcon from "~/assets/images/Food.png";
import "./Lesson.scss";
import { Link } from "react-router-dom";

const Lesson = () => {
  return (
    <>
      <section className="lesson mt">
        <div className="container">
          <div className="lesson__inner">
            <div className="lesson__head">
              <h1 className="lesson__title">Chọn chủ đề học tập</h1>
              <p className="lesson__description">
                Bắt đầu hành trình học ngôn ngữ ký hiệu với các chủ đề thú vị và
                thực tế
              </p>
            </div>

            <div className="lesson__body">
              <Card className="lesson__card">
                <img
                  src={FoodIcon}
                  alt="Icon"
                  width={50}
                  height={50}
                  className="lesson__card--icon"
                />

                <h3 className="lesson__card--title">Đồ ăn</h3>

                <p className="lesson__card--description">
                  Từ vựng về đồ ăn và nước uống
                </p>

                <div className="lesson__card--footer">
                  <div className="lesson__card--number">12 bài học</div>

                  <Button type="primary" size="large">
                    <Link to="/lesson/do-an">Học ngay</Link>
                  </Button>
                </div>
              </Card>

              <Card className="lesson__card">
                <img
                  src={FoodIcon}
                  alt="Icon"
                  width={50}
                  height={50}
                  className="lesson__card--icon"
                />

                <h3 className="lesson__card--title">Đồ ăn</h3>

                <p className="lesson__card--description">
                  Từ vựng về đồ ăn và nước uống
                </p>

                <div className="lesson__card--footer">
                  <div className="lesson__card--number">12 bài học</div>

                  <Button type="primary" size="large">
                    Học ngay
                  </Button>
                </div>
              </Card>

              <Card className="lesson__card">
                <img
                  src={FoodIcon}
                  alt="Icon"
                  width={50}
                  height={50}
                  className="lesson__card--icon"
                />

                <h3 className="lesson__card--title">Đồ ăn</h3>

                <p className="lesson__card--description">
                  Từ vựng về đồ ăn và nước uống
                </p>

                <div className="lesson__card--number">12 bài học</div>

                <Button type="primary" size="large">
                  Học ngay
                </Button>
              </Card>
            </div>

            <Pagination
              className="lesson__pagination"
              align="center"
              defaultCurrent={1}
              total={50}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Lesson;

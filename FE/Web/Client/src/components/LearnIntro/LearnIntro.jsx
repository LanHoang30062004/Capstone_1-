import { Link } from "react-router-dom";
import Background from "~/assets/images/Bg1.png";
import "./LearnIntro.scss";

const LearnIntro = () => {
  return (
    <>
      <section className="learn-intro">
        <div className="container">
          <div className="learn-intro__inner">
            <div className="learn-intro__left">
              <h2 className="learn-intro__title">
                Tất cả mọi thứ mà bạn có thể học trong lớp offline,{" "}
                <span>bạn đều có thể học với SignLearn</span>
              </h2>

              <p className="learn-intro__description">
                Bạn có thế học cách giao tiếp, các ngôn ngữ kí hiệu qua các
                video bài giảng với chất lượng cao. Ngoài ra hệ thống giúp nâng
                cao độ chính xác cách bạn học ngôn ngữ.
              </p>

              <Link className="learn-intro__link" to="/intro">
                Xem thêm
              </Link>
            </div>

            <div className="learn-intro__right">
              <img src={Background} alt="Background" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LearnIntro;

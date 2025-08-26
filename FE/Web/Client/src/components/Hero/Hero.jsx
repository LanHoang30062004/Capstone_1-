import BackgroundHero from "~/assets/images/BgHero.png";
import "./Hero.scss";

const Hero = () => {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div className="hero__left">
              <div className="hero__content">
                <h1 className="hero__title">
                  Học <span>Ngôn Ngữ Ký Hiệu</span> Dễ Dàng
                </h1>

                <p className="hero__description">
                  Khám phá thế giới giao tiếp bằng ngôn ngữ ký hiệu với công
                  nghệ AI hiện đại. Học tập hiệu quả, thực hành chính xác.
                </p>
              </div>

              <div className="hero__btn">
                <button className="hero__btn--learn btn">
                  Bắt đầu học ngay
                </button>
                <button className="hero__btn--intro btn">Tìm hiểu thêm</button>
              </div>
            </div>

            <div className="hero__right">
              <img src={BackgroundHero} alt="Background" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;

import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <h2 className="logo">
            Sign<span>Learn</span>
          </h2>
          <p className="footer__description">
            Nền tảng học ngôn ngữ ký hiệu hàng đầu Việt Nam, kết nối cộng đồng
            qua giao tiếp không lời.
          </p>
        </div>

        <div className="footer__links">
          <a href="#">Làm bài test</a>
          <a href="#">Bài học</a>
          <a href="#">Hỗ trợ</a>
        </div>

        <div className="footer__copy">© 2021 Class Technologies Inc.</div>
      </div>
    </footer>
  );
};

export default Footer;

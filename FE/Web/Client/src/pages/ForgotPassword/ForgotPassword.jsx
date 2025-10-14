import BackgroundLogin from "~/assets/images/Bg-login.png";
import "./ForgotPassword.scss";
import { Outlet } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <>
      <div className="forgot-pass">
        <div className="forgot-pass__body">
          <div className="forgot-pass__left">
            <div className="forgot-pass__background">
              <img src={BackgroundLogin} alt="Background" />
            </div>

            <div className="forgot-pass__intro">
              <h2 className="forgot-pass__intro--title">
                Học ngôn ngữ ký hiệu dễ dàng
              </h2>
              <p className="forgot-pass__intro--description">
                Bắt đầu hành trình giao tiếp không rào cản
              </p>
            </div>
          </div>

          <div className="forgot-pass__right">
            <div className="forgot-pass__form">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

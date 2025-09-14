import { Segmented } from "antd";
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BackgroundLogin from "~/assets/images/Bg-login.png";
import "./Auth.scss";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (value) => {
    navigate(`/${value}`);
  };

  return (
    <>
      <div className="auth">
        <div className="auth__body">
          <div className="auth__left">
            <div className="auth__background">
              <img src={BackgroundLogin} alt="Background" />
            </div>

            <div className="auth__intro">
              <h2 className="auth__intro--title">
                Học ngôn ngữ ký hiệu dễ dàng
              </h2>
              <p className="auth__intro--description">
                Bắt đầu hành trình giao tiếp không rào cản
              </p>
            </div>
          </div>

          <div className="auth__right">
            <div className="auth__content">
              <h3 className="auth__welcome">Chào mừng đến với SignLearn</h3>
              <Segmented
                shape="round"
                size="large"
                options={["login", "register"]}
                className="auth__segment"
                defaultValue={location.pathname.slice(1)}
                onChange={handleChange}
              />
              <p className="auth__description">
                SignLearn giúp bạn luyện tập và thành thạo ngôn ngữ ký hiệu qua
                các bài học tương tác, bài tập thực hành và cộng đồng hỗ trợ.
              </p>

              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;

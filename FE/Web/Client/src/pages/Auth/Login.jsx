import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as userService from "~/service/userService";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (value) => {
    const res = await userService.login(value);
    if (res.status > 400) {
      toast.error(res.message || "Đăng nhập thất bại!");
    } else {
      toast.success(res.message || "Đăng nhập thành công!");
      localStorage.setItem("accessToken", res.data);
      navigate("/");
    }
  };
  return (
    <>
      <div className="login">
        <Form className="login__form" layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email",
              },

              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Vui lòng nhập đúng định dạng email",
              },
            ]}
          >
            <Input placeholder="Nhập email..." className="input__custome" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu..."
              className="input__custome"
            />
          </Form.Item>

          <Form.Item>
            <Link className="login__forgot-pass" to="/forgot-pass">
              Quên mật khẩu?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              shape="round"
              className="button__custome"
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;

import { Button, Form, Input } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="login">
        <Form className="login__form" layout="vertical">
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
            <Link className="login__forgot-pass">Quên mật khẩu?</Link>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              shape="round"
              className="button__custome"
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

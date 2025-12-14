import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as userService from "~/service/userService";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    const res = await userService.register(value);
    if (res.status > 400) {
      toast.error(res?.message || "Đăng ký thất bại!");
    } else {
      toast.success(res?.message || "Đăng ký thành công!");
      navigate("/login");
    }
  };

  return (
    <>
      <div className="register">
        <Form
          className="register__form"
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="Tài khoản"
            normalize={(value) => value.trim()}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tài khoản",
              },
            ]}
          >
            <Input placeholder="Nhập tài khoản..." className="input__custome" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            normalize={(value) => value.trim()}
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

          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng nhập xác nhận mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu vừa nhập không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password className="input__custome" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              shape="round"
              className="button__custome"
              htmlType="submit"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Register;

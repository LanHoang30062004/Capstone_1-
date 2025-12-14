import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as userService from "~/service/userService";

const SendOtp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (value) => {
    try {
      setLoading(true);
      const response = await userService.forgot(value);

      if (response.status < 400) {
        toast.success("Gửi email xác minh thành công");
        navigate(`/check-pass/${value.email}`);
      } else toast.error(response.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form onFinish={handleForgotPassword}>
        <h2 className="forgot-pass__title">Quên mật khẩu</h2>
        <p className="forgot-pass__description">
          Vui lòng nhập email để lấy lại mật khẩu
        </p>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            {
              pattern: /^\S+@\S+\.\S+$/,
              message: "Vui lòng nhập email đúng định dạng!",
            },
          ]}
        >
          <Input placeholder="Email..." />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            Gửi mã OTP
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SendOtp;

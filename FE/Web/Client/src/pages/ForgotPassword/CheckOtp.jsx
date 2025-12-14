import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as userService from "~/service/userService";

const CheckOtp = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (values) => {
    try {
      setLoading(true);
      values.password = "";
      const response = await userService.checkOtp(values);

      console.log(response);

      if (response.status > 400) toast.error(response.message);
      else navigate(`/reset-password/${email}/${values.code}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await toast.promise(userService.forgot({ email: email }), {
        pending: "Đang gửi mã OTP...",
        success: "Gửi mã OTP thành công!",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form onFinish={handleSendOtp} initialValues={{ email: email }}>
        <h2 className="forgot-pass__title">Nhập OTP</h2>
        <p className="forgot-pass__description">
          Chúng tôi đã gửi mã otp cho email: {email}
        </p>

        <Form.Item
          name="email"
          normalize={(value) => value.trim()}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email!",
            },

            {
              pattern: /^\S+@\S+.\S+$/,
              message: "Vui lòng nhập email đúng định dạng!",
            },
          ]}
          style={{ display: "none" }}
        >
          <Input placeholder="Email..." value={email} />
        </Form.Item>

        <Form.Item
          name="code"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã otp!",
            },
          ]}
          className="input-otp"
        >
          <Input.OTP placeholder="Mã otp..." className="input" size="large" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            Xác minh
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="link"
            onClick={handleResendOtp}
            className="resend-otp"
            loading={loading}
          >
            Gửi lại mã OTP
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CheckOtp;

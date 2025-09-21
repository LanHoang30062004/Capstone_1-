import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as userService from "~/service/userService";

const SendOtp = () => {
  const navigate = useNavigate();

  const handleForgotPassword = async (value) => {
    try {
      const response = await userService.forgot(value);

      if (response.status < 400) navigate(`/check-pass/${value.email}`);
      else toast.error(response.message);
    } catch (error) {
      console.log(error);
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
          <Button block type="primary" htmlType="submit">
            Gửi mã OTP
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SendOtp;

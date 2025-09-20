import { Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import * as userService from "~/service/userService";

const SendOtp = () => {
  const handleForgotPassword = async (value) => {
    try {
      const response = await userService.forgot(value);

      console.log(response);
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

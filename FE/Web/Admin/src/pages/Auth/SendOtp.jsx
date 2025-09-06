import { Form, Input, Button } from "antd";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "~/assets/images/logo.png";
import { LoadingContext } from "~/context/LoadingContext";
import accountService from "~/services/accountService";

const SendOtp = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleSendOtp = async (values) => {
    try {
      toggleLoading(true);
      const response = await accountService.verifyOtp(values);

      toast.success(response);
      if (response) navigate(`/reset-password/${email}/${values.otpCode}`);
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      toggleLoading(true);
      toast.promise(accountService.forgotPassword({ email: email }), {
        pending: "Đang gửi mã OTP...",
        success: "Gửi mã OTP thành công!",
      });
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <>
      <div className="auth__container--left">
        <div className="content">
          <h2>Welcome</h2>
          <p>Nhập mã otp để xác minh</p>
        </div>
      </div>
      <div className="auth__container--right">
        <div className="auth__form">
          <Form onFinish={handleSendOtp} initialValues={{ email: email }}>
            <div className="auth__logo">
              <img src={Logo} alt="Logo" style={{ height: "100px" }} />
            </div>
            <h2 className="auth__title">Nhập OTP</h2>
            <p className="auth__description">
              Chúng tôi đã gửi mã otp cho email: {email}
            </p>

            <Form.Item
              name="email"
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
              name="otpCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã otp!",
                },
              ]}
              className="input-otp"
            >
              <Input.OTP
                placeholder="Mã otp..."
                className="input"
                size="large"
              />
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
        </div>
      </div>
    </>
  );
};

export default SendOtp;

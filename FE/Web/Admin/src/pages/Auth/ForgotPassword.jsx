import { Form, Input, Button, Flex } from "antd";
import Logo from "~/assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import accountService from "~/services/accountService";
import { toast } from "react-toastify";
import { LoadingContext } from "~/context/LoadingContext";
import { useContext } from "react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleForgotPassword = async (values) => {
    try {
      toggleLoading(true);
      const response = await accountService.forgotPassword(values);

      toast.success(response);
      if (response) navigate(`/send-otp/${values.email}`);
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
          <p>
            Quên mật khẩu? Hãy nhập email để chúng tôi gửi mã otp lấy lại mật
            khẩu cho bạn{" "}
          </p>
        </div>
      </div>
      <div className="auth__container--right">
        <div className="auth__form">
          <Form onFinish={handleForgotPassword}>
            <div className="auth__logo">
              <img src={Logo} alt="Logo" style={{ height: "100px" }} />
            </div>
            <h2 className="auth__title">Quên mật khẩu</h2>
            <p className="auth__description">
              Vui lòng nhập email để lấy lại mật khẩu
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
            >
              <Input placeholder="Email..." />
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit" loading={loading}>
                Gửi mã OTP
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

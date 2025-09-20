import { Form, Input, Button } from "antd";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "~/assets/images/logo.png";
import { LoadingContext } from "~/context/LoadingContext";
import accountService from "~/services/accountService";

const ResetPassword = () => {
  const { email, otpCode } = useParams();
  const navigate = useNavigate();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleResetPassword = async (values) => {
    try {
      toggleLoading(true);
      const data = {
        email: email,
        otpCode: otpCode,
        newPassword: values.newPassword,
      };

      const response = await accountService.resetPassword(data);

      toast.success(response);
      if (response) navigate("/login");
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
          <p>Đặt lại mật khẩu mới</p>
        </div>
      </div>
      <div className="auth__container--right">
        <div className="auth__form">
          <Form onFinish={handleResetPassword}>
            <div className="auth__logo">
              <img src={Logo} alt="Logo" style={{ height: "100px" }} />
            </div>
            <h2 className="auth__title">Đặt lại mật khẩu</h2>

            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ]}
            >
              <Input.Password placeholder="Mật khẩu mới" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu mới!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
              dependencies={["newPassword"]}
              hasFeedback
            >
              <Input.Password
                placeholder="Vui lòng nhập lại mật khẩu mới"
                autoComplete="new-password"
              />
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

export default ResetPassword;

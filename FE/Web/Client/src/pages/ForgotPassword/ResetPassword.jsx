import { Form, Input, Button } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as userService from "~/service/userService";

const ResetPassword = () => {
  const { email, code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (values) => {
    try {
      setLoading(true);
      const data = {
        email: email,
        code: code,
        password: values.newPassword,
      };

      const response = await userService.changePass(data);

      if (response.status < 400) {
        navigate(`/login`);
        toast.success("Thay đổi mật khẩu thành công");
      } else toast.error(response.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="forgot-pass__container--right">
        <div className="auth__form">
          <Form onFinish={handleResetPassword}>
            <h2 className="forgot-pass__title">Đặt lại mật khẩu</h2>

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
                { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Xác nhận mật khẩu không khớp"));
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
                Đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

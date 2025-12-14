import { Button, Flex, Form, Input } from "antd";
import Logo from "~/assets/images/Logo.png";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import accountService from "~/services/accountService";
import { toast } from "react-toastify";
import { LoadingContext } from "~/context/LoadingContext";
import { useContext } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleLogin = async (values) => {
    try {
      toggleLoading(true);
      const response = await accountService.login(values);

      const user = await accountService.getUser({ email: values.email });

      if (response.status !== 200) {
        toast.error("Tài khoản hoặc mật khẩu sai");
        return;
      }

      toast.success(response.message);
      localStorage.setItem("adminAccessToken", response.data);
      localStorage.setItem("adminInfo", JSON.stringify(user.data));

      navigate("/topic");
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
          <p>Vui lòng đăng nhập để truy cập vào hệ thống</p>
        </div>
      </div>
      <div className="auth__container--right">
        <div className="auth__form">
          <Form onFinish={handleLogin}>
            <div className="auth__logo">
              <img src={Logo} alt="Logo" />
            </div>
            <h2 className="auth__title">Đăng nhập</h2>

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
              normalize={(value) => value?.trim()}
            >
              <Input placeholder="Email..." />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password placeholder="Mật khẩu..." />
            </Form.Item>

            {/* <Form.Item>
              <Flex justify="end" align="center">
                <Link to="/forgot-password" className="auth__forgot-password">
                  Quên mật khẩu
                </Link>
              </Flex>
            </Form.Item> */}

            <Form.Item>
              <Button block type="primary" htmlType="submit" loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;

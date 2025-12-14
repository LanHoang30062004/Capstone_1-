import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoadingContext } from "~/context/LoadingContext";
import accountService from "~/services/accountService";

const EditAccount = (props) => {
  const { setEditMode } = props;
  const [infoAccount, setInfoAccount] = useState(null);
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleSubmit = async (values) => {
    try {
      toggleLoading(true);
      const updateInfo = {
        fullName: values.fullName,
        dateOfBirth: dayjs(values.dateOfBirth).format("DD/MM/YYYY"),
      };

      await accountService.updateInfoAccount(updateInfo);

      if (values.confirmNewPassword) {
        const changePassObject = {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
        };

        await accountService.changePassword(changePassObject);
      }

      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  useEffect(() => {
    const fetchInfoAccount = async () => {
      const response = await accountService.getInfoAccount();
      response.dateOfBirth = dayjs(response.dateOfBirth, "DD/MM/YYYY");

      setInfoAccount(response);
    };

    fetchInfoAccount();
  }, []);

  return (
    <>
      {infoAccount && (
        <Form
          layout="vertical"
          className="info-form info-form-center"
          onFinish={handleSubmit}
          initialValues={infoAccount}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="fullName" label="Họ và tên">
                <Input placeholder="Họ và tên" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                normalize={(value) => value.trim()}
              >
                <Input placeholder="Email" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dateOfBirth" label="Ngày sinh">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Ngày sinh"
                  disabledDate={(current) =>
                    current && current > dayjs().startOf("day")
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="currentPassword" label="Mật khẩu cũ">
                <Input.Password placeholder="Nhập mật khẩu cũ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="newPassword" label="Mật khẩu mới">
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="confirmNewPassword"
                label="Xác nhận mật khẩu"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          <div className="info-form-actions">
            <Button
              style={{ marginRight: 8 }}
              onClick={() => setEditMode(false)}
            >
              Huỷ
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu
            </Button>
          </div>
        </Form>
      )}
    </>
  );
};

export default EditAccount;

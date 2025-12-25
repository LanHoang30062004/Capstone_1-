import { Form, Input, Button, DatePicker, Radio, Card, Spin } from "antd";
import dayjs from "dayjs";
import "./Account.scss";
import { useEffect, useState } from "react";
import { editAccount, getUser } from "~/service/userService";
import { toast } from "react-toastify";

const Account = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  // Submit form
  const onFinish = async (values) => {
    const payload = {
      ...values,
      fullName: values.fullName.trim(),
      address: values.address?.trim(),
      phone: values.phone.trim(),
      dateOfBirth: values.dateOfBirth
        ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
        : null,
    };

    const response = await editAccount(payload);

    if (response.status > 400) toast.error(response.message);
    else {
      toast.success(response.message);
      localStorage.setItem("userInfo", JSON.stringify(payload));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        if (!userInfo?.email) return;

        const res = await getUser({ email: userInfo.email });
        setAccount(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!account) return;

    form.setFieldsValue({
      fullName: account.fullName || "",
      email: account.email || "",
      address: account.address || "",
      phone: account.phone || "",
      gender: account.gender || undefined,
      dateOfBirth: account.dateOfBirth ? dayjs(account.dateOfBirth) : null,
    });
  }, [account, form]);

  return (
    <section className="account">
      <div className="container">
        <div className="account__inner">
          <h1 className="account__title">Thông tin tài khoản</h1>

          <div className="account__form">
            <Card className="account__form--card">
              <Spin spinning={loading}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                  {/* Họ và tên */}
                  <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên" },
                      { min: 3, message: "Tối thiểu 3 ký tự" },
                      {
                        pattern: /^\D+$/,
                        message: "Họ và tên không được chứa số",
                      },
                    ]}
                  >
                    <Input placeholder="Họ và tên" />
                  </Form.Item>

                  {/* Email */}
                  <Form.Item name="email" label="Email">
                    <Input disabled />
                  </Form.Item>

                  {/* Địa chỉ */}
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ" },
                    ]}
                  >
                    <Input placeholder="Địa chỉ" />
                  </Form.Item>

                  {/* Số điện thoại */}
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                      {
                        pattern: /^0\d{9}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    ]}
                  >
                    <Input placeholder="0xxxxxxxxx" />
                  </Form.Item>

                  {/* Giới tính */}
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính" },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="male">Nam</Radio>
                      <Radio value="female">Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {/* Ngày sinh */}
                  <Form.Item
                    name="dateOfBirth"
                    label="Ngày sinh"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh" },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                      }
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      block
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                    >
                      Cập nhật thông tin
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;

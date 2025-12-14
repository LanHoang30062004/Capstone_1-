import React, { useState, useContext, useEffect } from "react";
import { Card, Form, Input, Button, Row, Col, Select, DatePicker } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./Info.css";
import { ThemeContext } from "~/context/themeContext";
import EditAccount from "./EditAccount";
import accountService from "~/services/accountService";
import { useDispatch } from "react-redux";
import { fetchAccountEdit } from "~/redux/account/accountSlice";
import { toast } from "react-toastify";

const InfoAccount = () => {
  const [form] = Form.useForm();
  const { myTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute("data-theme", myTheme);
    return () => {
      document.body.removeAttribute("data-theme");
    };
  }, [myTheme]);

  const hanldeSumit = async (value) => {
    value.dateOfBirth = dayjs(value.dateOfBirth).format("YYYY-MM-DD");
    const response = await dispatch(fetchAccountEdit(value));

    if (response.status > 400) toast.error(response.message);
    else {
      toast.success(response.message);
    }

    form.setFieldsValue({
      id: value.id,
      fullName: value.fullName || "",
      email: value.email || "",
      address: value.address || "",
      phone: value.phone || "",
      gender: value.gender || undefined,
      dateOfBirth: value.dateOfBirth ? dayjs(value.dateOfBirth) : null,
    });
  };

  // Load user info from localStorage
  useEffect(() => {
    const fetchUserDetail = async () => {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const user = await accountService.getUserById(userInfo?.id);

      if (user?.data) {
        form.setFieldsValue({
          id: user?.data?.id,
          fullName: user?.data?.fullName || "",
          email: user?.data?.email || "",
          address: user?.data?.address || "",
          phone: user?.data?.phone || "",
          gender: user?.data?.gender || undefined,
          dateOfBirth: user?.data?.dateOfBirth
            ? dayjs(user?.data?.dateOfBirth)
            : null,
        });
      }
    };

    fetchUserDetail();
  }, [form]);

  return (
    <div className="info-page-container">
      <Card className="info-card" variant="borderless">
        <div className="ant-card-body">
          <div className="info-header-row">
            <Button
              type="text"
              icon={<span style={{ fontSize: 16 }}>⤺</span>}
              onClick={() => navigate(-1)}
              className="info-back-btn"
            >
              Quay lại
            </Button>

            <span className="info-tab active info-title">
              <UserOutlined style={{ marginRight: 8 }} /> Thông tin cá nhân
            </span>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="info-form info-form-center"
            onFinish={hanldeSumit}
          >
            <Row gutter={32} justify="center">
              <Col span={24}>
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập họ và tên",
                          },
                          { min: 3, message: "Họ và tên tối thiểu 3 ký tự" },
                        ]}
                        normalize={(value) => value?.trim()}
                      >
                        <Input placeholder="Họ và tên" />
                      </Form.Item>
                    </Col>

                    <Form.Item name="id" style={{ display: "none" }}>
                      <Input placeholder="Họ và tên" />
                    </Form.Item>

                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                          { type: "email", message: "Email không hợp lệ" },
                        ]}
                      >
                        <Input placeholder="Email" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập địa chỉ",
                          },
                        ]}
                        normalize={(value) => value?.trim()}
                      >
                        <Input placeholder="Địa chỉ" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                          {
                            pattern: /^\d{10}$/,
                            message: "Số điện thoại phải gồm đúng 10 chữ số",
                          },
                        ]}
                      >
                        <Input placeholder="Số điện thoại" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn giới tính",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn giới tính">
                          <Select.Option value="male">Nam</Select.Option>
                          <Select.Option value="female">Nữ</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="dateOfBirth"
                        label="Ngày sinh"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày sinh",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD/MM/YYYY"
                          placeholder="Chọn ngày sinh"
                          disabledDate={(current) =>
                            current && current > dayjs().endOf("day")
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    Sửa
                  </Button>
                </>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default InfoAccount;

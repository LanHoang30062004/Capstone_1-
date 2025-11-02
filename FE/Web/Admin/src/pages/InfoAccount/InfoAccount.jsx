import React, { useState, useContext, useEffect } from "react";
import { Card, Form, Input, Button, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Info.css";
import { ThemeContext } from "~/context/themeContext";
import EditAccount from "./EditAccount";

const InfoAccount = () => {
  const [form] = Form.useForm();
  const { myTheme } = useContext(ThemeContext);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // Cập nhật data-theme cho body khi theme thay đổi
  useEffect(() => {
    document.body.setAttribute("data-theme", myTheme);
    return () => {
      document.body.removeAttribute("data-theme");
    };
  }, [myTheme]);

  // Fetch user profile khi vào trang
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));

      if (userInfo) {
        // Map dữ liệu mới vào form
        form.setFieldsValue({
          fullName: userInfo.fullName || "",
          email: userInfo.email || "",
          address: userInfo.address || "",
          phone: userInfo.phone || "",
          gender: userInfo.gender || "",
          dateOfBirth: userInfo.dateOfBirth || "",
          password: userInfo.password || "",
        });
      }
    };

    fetchUserProfile();
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
              style={{ display: editMode ? "none" : undefined }}
            >
              Quay lại
            </Button>
            <span className="info-tab active info-title">
              <UserOutlined style={{ marginRight: 8 }} /> Thông tin cá nhân
            </span>
            {!editMode && (
              <Button
                type="primary"
                style={{ float: "right" }}
                onClick={() => setEditMode(true)}
              >
                Sửa
              </Button>
            )}
          </div>
          <Form
            form={form}
            layout="vertical"
            className="info-form info-form-center"
          >
            <Row gutter={32} justify="center">
              <Col span={24}>
                {!editMode && (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="fullName" label="Họ và tên">
                          <Input placeholder="Họ và tên" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="email" label="Email">
                          <Input placeholder="Email" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="address" label="Địa chỉ">
                          <Input placeholder="Địa chỉ" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="phone" label="Số điện thoại">
                          <Input placeholder="Số điện thoại" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="gender" label="Giới tính">
                          <Input placeholder="Giới tính" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="dateOfBirth" label="Ngày sinh">
                          <Input placeholder="Ngày sinh" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </Form>

          {editMode && <EditAccount setEditMode={setEditMode} />}
        </div>
      </Card>
    </div>
  );
};

export default InfoAccount;

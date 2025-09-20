import React, { useState, useContext, useEffect } from "react";
import { Card, Form, Input, Button, DatePicker, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Info.css";
import { ThemeContext } from "~/context/themeContext";
import EditAccount from "./EditAccount";
import accountService from "~/services/accountService";

const InfoAccount = () => {
  const [form] = Form.useForm();
  const { myTheme } = useContext(ThemeContext);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // Đảm bảo cập nhật data-theme cho body khi theme thay đổi
  useEffect(() => {
    document.body.setAttribute("data-theme", myTheme);
    return () => {
      document.body.removeAttribute("data-theme");
    };
  }, [myTheme]);

  // Fetch user profile khi vào trang
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { userName } = JSON.parse(localStorage.getItem("userInfo"));
      const employeeProfile = await accountService.getInfoEmployee(userName);

      form.setFieldsValue(employeeProfile);
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
              <Col
                span={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {!editMode && (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="employeeID" label="Mã nhân viên">
                          <Input placeholder="Mã nhân viên" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="fullName" label="Họ và tên">
                          <Input placeholder="Họ và tên" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="dateOfBirth" label="Ngày sinh">
                          <Input placeholder="Ngày sinh" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="gender" label="Giới tính">
                          <Input placeholder="Giới tính" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="phoneNumber" label="Số điện thoại">
                          <Input placeholder="Số điện thoại" disabled />
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
                        <Form.Item name="hireDate" label="Ngày vào làm">
                          <Input placeholder="Ngày vào làm" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="departmentName" label="Phòng ban">
                          <Input placeholder="Phòng ban" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="positionName" label="Mã vị trí">
                          <Input placeholder="Mã vị trí" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="status" label="Trạng thái">
                          <Input placeholder="Trạng thái" disabled />
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

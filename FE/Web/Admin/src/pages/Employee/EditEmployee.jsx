import React, { useContext, useEffect } from "react";
import Header from "~/components/Header/Header";
import { UserOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Row,
  Select,
} from "antd";
import Input from "antd/es/input/Input";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoadingContext } from "~/context/LoadingContext";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const departments = useSelector(
    (state) => state.department.currentDepartment
  );
  const positions = useSelector((state) => state.position.currentPosition);
  const employeeDetail = useSelector((state) => state.employee.employeeDetail);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const optionsGender = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
  ];

  const optionsStatus = [
    { value: "Đang làm", label: "Đang làm" },
    { value: "Nghỉ việc", label: "Nghỉ việc" },
  ];

  const handleEditEmployee = (values) => {
    try {
      toggleLoading(true);
      values.dateOfBirth = dayjs(values.dateOfBirth).format("DD/MM/YYYY");
      values.hireDate = dayjs(values.hireDate).format("DD/MM/YYYY");
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  // useEffect(() => {
  //   if (employeeDetail) {
  //     form.setFieldsValue({
  //       ...employeeDetail,
  //       dateOfBirth: dayjs(employeeDetail.dateOfBirth, "DD/MM/YYYY").isValid()
  //         ? dayjs(employeeDetail.dateOfBirth, "DD/MM/YYYY")
  //         : null,
  //       hireDate: dayjs(employeeDetail.hireDate, "DD/MM/YYYY").isValid()
  //         ? dayjs(employeeDetail.hireDate, "DD/MM/YYYY")
  //         : null,
  //     });
  //   }
  // }, [employeeDetail]);

  return (
    <>
      <div className="employee__edit contain">
        <Header
          title="Cập nhật nhân viên"
          subTitle="Tất cả nhân viên > Cập nhật nhân viên"
        />

        <div className="employee__form">
          <Flex align="center" gap={5} className="employee__head">
            <UserOutlined style={{ color: "var(--color-purple)" }} />
            <span>Thông tin cá nhân</span>
          </Flex>
          <Divider />

          <Form form={form} onFinish={handleEditEmployee}>
            <Row align="center" gap={20} gutter={[20, 20]}>
              <Col sm={12}>
                <Form.Item
                  name="employeeID"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mã nhân viên!",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "Mã nhân viên chỉ được chứa số!",
                    },
                  ]}
                >
                  <Input placeholder="Mã nhân viên" />
                </Form.Item>
              </Col>

              <Col sm={12}>
                <Form.Item
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên nhân viên!",
                    },

                    {
                      pattern: /^\D+[^@!#$%^&*()_+={}|:;<>,.?~-]+$/,
                      message: "Tên nhân viên không được chứa số",
                    },
                  ]}
                >
                  <Input placeholder="Tên nhân viên" />
                </Form.Item>
              </Col>
            </Row>

            <Row align="center" gap={20} gutter={[20, 20]}>
              <Col sm={12}>
                <Form.Item
                  name="dateOfBirth"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập ngày sinh!",
                    },

                    {
                      validator: (_, value) => {
                        if (value && value.isAfter(dayjs(), "day")) {
                          return Promise.reject(
                            "Ngày sinh không được lớn hơn ngày hiện tại"
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    placeholder="Ngày sinh"
                    disabledDate={(current) => current && current > dayjs()}
                  />
                </Form.Item>
              </Col>

              <Col sm={12}>
                <Form.Item
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn giới tính",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn giới tính"
                    options={optionsGender}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row align="center" gap={20} gutter={[20, 20]}>
              <Col sm={12}>
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại!",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "Số điện thoại không được chứa chữ",
                    },
                  ]}
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </Col>

              <Col sm={12}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                    },
                    {
                      pattern: /^\S+@\S+.\S+$/,
                      message: "Vui lòng nhập đúng định dạng email",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </Col>
            </Row>

            <Row align="center" gap={20} gutter={[20, 20]}>
              <Col sm={12}>
                <Form.Item
                  name="hireDate"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày bắt đầu làm việc",
                    },
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    placeholder="Ngày bắt đầu làm việc"
                  />
                </Form.Item>
              </Col>

              <Col sm={12}>
                <Form.Item
                  name="departmentID"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phòng ban",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn phòng ban"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row align="center" gap={20} gutter={[20, 20]}>
              <Col sm={12}>
                <Form.Item
                  name="positionID"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn vị trí",
                    },
                  ]}
                >
                  <Select placeholder="Chọn vị trí" />
                </Form.Item>
              </Col>

              <Col sm={12}>
                <Form.Item
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn",
                    },
                  ]}
                >
                  <Select placeholder="Trạng thái" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="employee__form--action">
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                size="large"
                style={{ margin: 20 }}
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
              >
                Chỉnh sửa
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EditEmployee;

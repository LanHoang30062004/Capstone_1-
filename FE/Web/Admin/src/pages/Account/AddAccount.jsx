import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { roles } from "~/configs/rbacConfig";
import { LoadingContext } from "~/context/LoadingContext";

const AddAccount = (props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleAdd = async (value) => {
    try {
      toggleLoading(true);
      value.dateOfBirth = dayjs(value.dateOfBirth).format("DD/MM/YYYY");
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  const optionsRole = [
    { label: "Admin", value: roles.ADMIN },
    { label: "HR Manager", value: roles.HR_MANAGER },
    { label: "Payroll Manager", value: roles.PAYROLL_MANAGER },
    { label: "Employee", value: roles.EMPLOYEE },
  ];

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Thêm tài khoản </h4>}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Huỷ
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={() => form.submit()}
            loading={loading}
          >
            Thêm tài khoản
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email",
              },

              {
                pattern: /^\S+@\S+.\S+$/,
                message: "Vui lòng nhập đúng định dạng email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Ngày sinh"
              disabledDate={(current) =>
                current && current > dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn vai trò",
              },
            ]}
          >
            <Select placeholder="Chọn vai trò" options={optionsRole} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAccount;

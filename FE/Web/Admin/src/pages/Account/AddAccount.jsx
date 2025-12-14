import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { roles } from "~/configs/rbacConfig";
import { LoadingContext } from "~/context/LoadingContext";
import { fetchAccountAddAdmin } from "~/redux/account/accountSlice";

const AddAccount = (props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleAdd = async (value) => {
    try {
      toggleLoading(true);
      value.dateOfBirth = dayjs(value.dateOfBirth).format("YYYY-MM-DD");
      await dispatch(fetchAccountAddAdmin(value));
    } catch (error) {
      toast.error(error);
    } finally {
      toggleLoading(false);
    }
  };

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
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Vui lòng nhập đúng định dạng email",
              },

              {
                max: 256,
                message: "Email không dài quá 256 kí tự",
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

              {
                max: 256,
                message: "Mật khẩu không dài quá 256 kí tự",
              },

              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                message:
                  "Mật khẩu phải chứ ít nhât 1 chữ hoa, 1 chữ thường, 1 chữ số",
              },

              {
                min: 6,
                message: "Mật khẩu phải từ 6 ký tự trở lên",
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

          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^\d+$/,
                message: "Số điện thoại chỉ được chứa số",
              },

              {
                max: 10,
                message: "Số điện thoại chỉ chứa 10 số",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select
              options={[
                { value: "Nam", label: "Nam" },
                { value: "Nữ", label: "Nữ" },
              ]}
              defaultValue={"Nam"}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAccount;

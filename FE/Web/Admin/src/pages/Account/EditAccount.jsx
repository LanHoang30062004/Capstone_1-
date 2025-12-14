import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { LoadingContext } from "~/context/LoadingContext";
import { fetchAccount, fetchAccountEdit } from "~/redux/account/accountSlice";

const EditAccount = (props) => {
  const { open, setOpen, account } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, toggleLoading } = useContext(LoadingContext);

  const handleEdit = async (value) => {
    try {
      toggleLoading(true);
      value.dateOfBirth = dayjs(value.dateOfBirth).format("YYYY-MM-DD");
      await dispatch(fetchAccountEdit(value));
      const searchObject = {
        page: 1,
        size: 20,
      };

      dispatch(fetchAccount(searchObject));
    } catch (error) {
      toast.error(error);
    } finally {
      toggleLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      form.setFieldsValue({
        ...account,
        dateOfBirth: account.dateOfBirth ? dayjs(account.dateOfBirth) : null,
      });
    }
  }, [account, form]);

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Chỉnh sửa tài khoản </h4>}
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
            Chỉnh sửa
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleEdit} layout="vertical">
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
            normalize={(value) => value.trim()}
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
            <Input disabled />
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
              defaultValue="Nam"
              options={[
                { value: "Nam", label: "Nam" },
                { value: "Nữ", label: "Nữ" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditAccount;

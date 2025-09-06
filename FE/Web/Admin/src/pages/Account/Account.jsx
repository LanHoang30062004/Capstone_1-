import Header from "~/components/Header/Header";
import React, { useEffect, useState } from "react";
import { Button, Card, Flex, Form, Input, Popconfirm, Table, Tag } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import AddAccount from "./AddAccount";
import DetailAccount from "./DetailAccount";
import { roles } from "~/configs/rbacConfig";
import "./Account.css";

const columns = [
  { title: "Tên tài khoản", dataIndex: "account_name" },
  { title: "Email", dataIndex: "email" },
  { title: "Ngày sinh", dataIndex: "date_of_birth" },
  { title: "Vai trò", dataIndex: "role" },
  { title: "Hành động", dataIndex: "action" },
];

const Account = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [openAddAccount, setOpenAddAccount] = useState(false);
  const [account, setAccount] = useState(null);

  const accounts = useSelector((state) => state.account.currentAccount);

  const dispatch = useDispatch();

  const handleOpen = (setOpen, account) => {
    setOpen(true);
    setAccount(account);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // const handleDelete = (username) => {
  //   dispatch(fetchAccountDeleteApi(username));
  //   dispatch(deleteAccount(username));
  // };

  const handleSearch = (value) => {
    console.log(value);
  };

  // useEffect(() => {
  //   dispatch(fetchAccountGetAllApi());
  // }, [dispatch]);

  const dataSource = accounts.map((account) => {
    let role = null;
    if (account.role === roles.ADMIN) {
      role = <Tag color="error">Admin</Tag>;
    } else if (account.role === roles.HR_MANAGER) {
      role = <Tag color="blue">HR</Tag>;
    } else if (account.role === roles.PAYROLL_MANAGER) {
      role = <Tag color="orange">Payroll</Tag>;
    } else if (account.role === roles.EMPLOYEE) {
      role = <Tag color="success">Employee</Tag>;
    }

    return {
      key: account.id,
      account_name: account.fullName,
      email: account.email,
      date_of_birth: account.dateOfBirth,
      role: role,
      action: (
        <Flex align="center" gap="small">
          <EyeOutlined
            className="table__icon"
            onClick={() => handleOpen(setOpenDetail, account)}
          />
          <Popconfirm
            title="Xoá tài khoản"
            description="Bạn có chắc muốn xoá tài khoản này?"
            onConfirm={() => handleDelete(account.email)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <DeleteOutlined className="table__icon" />
          </Popconfirm>
        </Flex>
      ),
    };
  });

  return (
    <>
      <div className="account__list contain">
        <Header title="Tài khoản" subTitle="Danh sách tài khoản" />

        <Card className="account__table table">
          <div className="account__table--head">
            <Flex align="center" justify="space-between">
              <div className="account__search">
                <Form onFinish={handleSearch}>
                  <Form.Item name="search">
                    <Input
                      placeholder="Tìm kiếm"
                      prefix={<SearchOutlined className="table__icon" />}
                      className="table__search"
                    />
                  </Form.Item>
                </Form>
              </div>

              <div className="account__action">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={() => setOpenAddAccount(true)}
                >
                  Thêm tài khoản
                </Button>
              </div>
            </Flex>
          </div>

          <Table
            columns={columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            style={{ marginTop: 20 }}
          />
        </Card>
      </div>

      {openDetail && (
        <DetailAccount
          open={openDetail}
          setOpen={setOpenDetail}
          account={account}
        />
      )}

      {openAddAccount && (
        <AddAccount open={openAddAccount} setOpen={setOpenAddAccount} />
      )}
    </>
  );
};

export default Account;

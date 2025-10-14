import Header from "~/components/Header/Header";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Pagination,
  Popconfirm,
  Table,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./Account.scss";
import { fetchAccount, fetchAccountDelete } from "~/redux/account/accountSlice";
import AddAccount from "./AddAccount";
import EditAccount from "./EditAccount";
import DetailAccount from "./DetailAccount";

const columns = [
  { title: "Id", dataIndex: "accountId" },
  { title: "fullName", dataIndex: "fullName" },
  { title: "email", dataIndex: "email" },
  { title: "phone", dataIndex: "phone" },
  { title: "Hành động", dataIndex: "action" },
];

const FlashCard = () => {
  const [openAddAccount, setOpenAddAccount] = useState(false);
  const [openDetailAccount, setOpenDetailAccount] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [account, setAccount] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const accounts = useSelector((state) => state.account.accounts);

  const dispatch = useDispatch();

  const handleOpenModal = (setOpen, word) => {
    setOpen(true);
    setAccount(word);
  };

  useEffect(() => {
    const searchObject = Object.fromEntries(searchParams.entries());

    if (Object.keys(searchObject).length === 0) {
      searchObject.page = 1;
      searchObject.size = 10;
    }

    searchObject.page = parseInt(searchObject.page);
    searchObject.size = parseInt(searchObject.size);

    dispatch(fetchAccount(searchObject));
  }, [dispatch, searchParams]);

  const handleDelete = async (id) => {
    try {
      await toast.promise(dispatch(fetchAccountDelete(id)), {
        pending: "Đang xoá...",
      });

      const searchObject = Object.fromEntries(searchParams.entries());

      if (account?.items.length === 1) {
        setSearchParams({
          ...searchObject,
          page: searchParams.get("page") - 1,
        });
      }

      toast.success("Xoá thành công!");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSearch = (value) => {
    const searchObject = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...searchObject,
      search: value.search,
    });
  };

  const handleChangePage = (page, pageSize) => {
    const searchObject = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...searchObject,
      page: page,
      size: pageSize,
    });
  };

  const dataSource = accounts?.items?.map((account) => {
    return {
      key: account?.id,
      accountId: account?.id,
      fullName: account?.fullName,
      email: account?.email,
      phone: account?.phone,
      action: (
        <Flex align="center" gap="small">
          <EyeOutlined
            className="table__icon"
            onClick={() => handleOpenModal(setOpenDetailAccount, account)}
          />

          <EditOutlined
            className="table__icon"
            onClick={() => handleOpenModal(setEditModal, account)}
          />

          <Popconfirm
            title="Xoá tài khoản"
            description="Bạn có chắc muốn xoá tài khoản này?"
            onConfirm={() => handleDelete(account.id)}
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
      <div className="flash-card_list contain">
        <Header title="Flash Card" subTitle="Danh sách flash card" />

        <Card className="flash-card_table table">
          <div className="flash-card_table--head">
            <Flex align="center" justify="space-between">
              <div className="flash-card_search">
                <Form onFinish={handleSearch}>
                  <Form.Item name="search" noStyle>
                    <Input
                      placeholder="Tìm kiếm"
                      prefix={<SearchOutlined className="table__icon" />}
                      className="table__search"
                    />
                  </Form.Item>

                  <Form.Item style={{ display: "none" }}>
                    <Button type="primary" htmlType="submit">
                      Tìm kiếm
                    </Button>
                  </Form.Item>
                </Form>
              </div>

              <div className="flash-card_action">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={() => setOpenAddAccount(true)}
                >
                  Thêm admin
                </Button>
              </div>
            </Flex>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            style={{ marginTop: 20, marginBottom: 20 }}
            pagination={false}
          />

          <Pagination
            current={parseInt(searchParams.get("page")) || 1}
            total={accounts?.totalPages * accounts?.pageSize}
            align="end"
            onChange={handleChangePage}
            pageSize={accounts?.pageSize || 10}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card>
      </div>

      {openDetailAccount && (
        <DetailAccount
          open={openDetailAccount}
          setOpen={setOpenDetailAccount}
          account={account}
        />
      )}

      {openAddAccount && (
        <AddAccount open={openAddAccount} setOpen={setOpenAddAccount} />
      )}

      {editModal && (
        <EditAccount
          open={editModal}
          setOpen={setEditModal}
          account={account}
        />
      )}
    </>
  );
};

export default FlashCard;

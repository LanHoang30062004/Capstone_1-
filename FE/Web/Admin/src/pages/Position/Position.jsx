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
  Tag,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import DetailPosition from "./DetailPosition";
import AddPosition from "./AddPosition";
import EditPosition from "./EditPosition";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchPositionDeleteApi,
  fetchPositionGetAllApi,
} from "~/redux/position/positionSlice";
import "./Position.css";

const columns = [
  { title: "Mã vị trí", dataIndex: "positionID" },
  { title: "Tên vị trí", dataIndex: "positionName" },
  { title: "Hành động", dataIndex: "action" },
];

const Position = () => {
  const [openDetail, setOpenDetail] = useState(false);
  const [openAddPosition, setOpenAddPosition] = useState(false);
  const [openEditPosition, setOpenEditPosition] = useState(false);
  const [position, setPosition] = useState(null);
  const positions = useSelector((state) => state.position);
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  useEffect(() => {
    const searchObject = Object.fromEntries(searchParams.entries());

    dispatch(fetchPositionGetAllApi(searchObject));
  }, [dispatch, searchParams]);

  const handleOpenModal = (setOpen, position) => {
    setOpen(true);
    setPosition(position);
  };

  const handleDelete = (positionID) => {
    toast.promise(dispatch(fetchPositionDeleteApi(positionID)), {
      pending: "Đang xoá...",
    });

    if (positions.currentPosition.length === 1) {
      const searchObject = Object.fromEntries(searchParams.entries());

      setSearchParams({
        ...searchObject,
        PageNumber: searchParams.get("PageNumber") - 1,
      });
    }
  };

  const handleSearch = (value) => {
    const searchObject = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...searchObject,
      positionFind: value.search,
    });
  };

  const handleChangePage = (page) => {
    const searchObject = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...searchObject,
      PageNumber: page,
    });
  };

  const dataSource = positions?.currentPosition.map((position) => {
    return {
      key: position.positionID,
      positionID: position.positionID,
      positionName: position.positionName,
      action: (
        <Flex align="center" gap="small">
          <EyeOutlined
            className="table__icon"
            onClick={() => handleOpenModal(setOpenDetail, position)}
          />
          <EditOutlined
            className="table__icon"
            onClick={() => handleOpenModal(setOpenEditPosition, position)}
          />
          <Popconfirm
            title="Xoá vị trí"
            description="Bạn có chắc muốn xoá vị trí này?"
            onConfirm={() => handleDelete(position.positionID)}
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
      <div className="position__list contain">
        <Header title="Vị trí" subTitle="Danh sách vị trí" />

        <Card className="position__table table">
          <div className="position__table--head">
            <Flex align="center" justify="space-between">
              <div className="position__search">
                <Form onFinish={handleSearch}>
                  <Form.Item name="search">
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

              <div className="position__action">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={() => setOpenAddPosition(true)}
                >
                  Thêm vị trí
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
            current={parseInt(searchParams.get("PageNumber")) || 1}
            total={positions?.totalCount}
            align="end"
            showTotal={(total) => `Tổng: ${total} vị trí`}
            onChange={handleChangePage}
          />
        </Card>
      </div>

      {openDetail && (
        <DetailPosition
          open={openDetail}
          setOpen={setOpenDetail}
          position={position}
        />
      )}
      {openAddPosition && (
        <AddPosition open={openAddPosition} setOpen={setOpenAddPosition} />
      )}
      {openEditPosition && (
        <EditPosition
          open={openEditPosition}
          setOpen={setOpenEditPosition}
          position={position}
        />
      )}
    </>
  );
};

export default Position;

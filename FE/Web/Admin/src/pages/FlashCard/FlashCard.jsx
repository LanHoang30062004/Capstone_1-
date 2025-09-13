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
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./FlashCard.scss";
import { fetchWord, fetchWordDelete } from "~/redux/word/wordSlice";
import EditWord from "./EditWord";
import AddFlashCard from "./AddFlashCard";
import { fetchFlashCard } from "~/redux/flashCard/flashCardSlice";

const columns = [
  { title: "Mã flashCard", dataIndex: "flashCardId" },
  { title: "Nội dung", dataIndex: "content" },
  { title: "Hành động", dataIndex: "action" },
];

const FlashCard = () => {
  // const [openDetail, setOpenDetail] = useState(false);
  const [openAddFlashCard, setOpenAddFlashCard] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [word, setWord] = useState(null);
  // const [openEditPosition, setOpenEditPosition] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const flashCards = useSelector((state) => state.flashCard.flashCards);

  const dispatch = useDispatch();

  useEffect(() => {
    const searchObject = Object.fromEntries(searchParams.entries());

    if (Object.keys(searchObject).length === 0) {
      setSearchParams({
        page: 1,
        size: 10,
      });
    }

    dispatch(fetchFlashCard(searchObject));
  }, [dispatch, searchParams]);

  const handleOpenModal = (setOpen, word) => {
    setOpen(true);
    setWord(word);
  };

  const handleDelete = (wordId) => {
    try {
      toast.promise(dispatch(fetchWordDelete(wordId)), {
        pending: "Đang xoá...",
      });

      if (flashCards?.items.length === 1) {
        const searchObject = Object.fromEntries(searchParams.entries());
        setSearchParams({
          ...searchObject,
          page: searchParams.get("page") - 1,
        });
      }

      toast.success("Xoá thành công!");
    } catch (error) {
      console.log(error);
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

  const dataSource = flashCards?.items?.map((flashCard) => {
    return {
      key: flashCard.content,
      flashCardId: flashCard.wordId,
      content: flashCard.content,
      action: (
        <Flex align="center" gap="small">
          <Link to="/flash-card/1">
            <EyeOutlined className="table__icon" />
          </Link>
          <EditOutlined
            className="table__icon"
            onClick={() => handleOpenModal(setEditModal, word)}
          />
          <Popconfirm
            title="Xoá kí hiệu"
            description="Bạn có chắc muốn xoá kí hiệu này?"
            onConfirm={() => handleDelete(word.wordId)}
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

              <div className="flash-card_action">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={() => setOpenAddFlashCard(true)}
                >
                  Thêm flash card
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
            total={flashCards?.totalPages * flashCards?.pageSize}
            align="end"
            onChange={handleChangePage}
            pageSize={flashCards?.pageSize || 10}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card>
      </div>
      {openAddFlashCard && (
        <AddFlashCard open={openAddFlashCard} setOpen={setOpenAddFlashCard} />
      )}

      {editModal && (
        <EditWord open={editModal} setOpen={setEditModal} word={word} />
      )}
    </>
  );
};

export default FlashCard;

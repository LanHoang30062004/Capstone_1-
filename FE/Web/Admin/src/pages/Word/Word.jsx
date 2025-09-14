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
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./Word.scss";
import AddWord from "./AddWord";
import { fetchWord, fetchWordDelete } from "~/redux/word/wordSlice";
import EditWord from "./EditWord";

const columns = [
  { title: "Mã kí hiệu", dataIndex: "wordId" },
  { title: "Video", dataIndex: "videoUrl" },
  { title: "Tên kí hiệu", dataIndex: "wordName" },
  { title: "Nghĩa kí hiệu", dataIndex: "wordMeaning" },
  { title: "Hành động", dataIndex: "action" },
];

const Word = () => {
  const [openAddWord, setOpenAddWord] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [word, setWord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const words = useSelector((state) => state.word.words);

  const dispatch = useDispatch();

  useEffect(() => {
    const searchObject = Object.fromEntries(searchParams.entries());

    if (Object.keys(searchObject).length === 0) {
      setSearchParams({
        page: 1,
        size: 10,
      });
    }

    dispatch(fetchWord(searchObject));
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

      if (words.items.length === 1) {
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
      page: 1,
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

  const dataSource = words?.items?.map((word) => {
    return {
      key: word.wordId,
      wordId: word.wordId,
      videoUrl: <video src={word.videoUrl} controls width={200} />,
      wordName: word.wordName,
      wordMeaning: word.wordMeaning,
      action: (
        <Flex align="center" gap="small">
          {/* <EyeOutlined
            className="table__icon"
            onClick={() => handleOpenModal(setOpenDetail, position)}
          /> */}
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
      <div className="word__list contain">
        <Header title="Kí hiệu" subTitle="Danh sách kí hiệu" />

        <Card className="word__table table">
          <div className="word__table--head">
            <Flex align="center" justify="space-between">
              <div className="word__search">
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

              <div className="word__action">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={() => setOpenAddWord(true)}
                >
                  Thêm kí hiệu
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
            total={words?.totalPages * words?.pageSize}
            align="end"
            onChange={handleChangePage}
            pageSize={words?.pageSize || 10}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card>
      </div>
      {openAddWord && <AddWord open={openAddWord} setOpen={setOpenAddWord} />}

      {/* {openDetail && (
        <DetailPosition
          open={openDetail}
          setOpen={setOpenDetail}
          position={position}
        />
      )} */}

      {editModal && (
        <EditWord open={editModal} setOpen={setEditModal} word={word} />
      )}
    </>
  );
};

export default Word;

import Header from "~/components/Header/Header";
import { useEffect } from "react";
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
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./Topic.scss";
import { fetchTopic, fetchTopicDelete } from "~/redux/topic/topicSlice";

const columns = [
  { title: "Mã chủ đề", dataIndex: "topicId" },
  { title: "Nội dung", dataIndex: "content" },
  { title: "Thời gian", dataIndex: "durationMinutes" },
  { title: "Số lượng câu hỏi", dataIndex: "numberOfQuestion" },
  { title: "Hành động", dataIndex: "action" },
];

const Topic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const topics = useSelector((state) => state.topic.topics);
  const navigate = useNavigate();

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

    dispatch(fetchTopic(searchObject));
  }, [dispatch, searchParams]);

  const handleDelete = async (topicId) => {
    try {
      await toast.promise(dispatch(fetchTopicDelete(topicId)), {
        pending: "Đang xoá...",
      });

      if (topics.length === 1) {
        const searchObject = Object.fromEntries(searchParams.entries());
        setSearchParams({
          ...searchObject,
          page: searchParams.get("page") - 1,
        });
      }
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

  const dataSource = topics?.map((topic) => {
    return {
      key: topic.id,
      topicId: topic.id,
      content: topic.content,
      durationMinutes: topic.durationMinutes,
      numberOfQuestion: topic.numberOfQuestion,
      action: (
        <Flex align="center" gap="small">
          <Link to={`/topic/${topic.id}`}>
            <EyeOutlined className="table__icon" />
          </Link>

          <Popconfirm
            title="Xoá kí hiệu"
            description="Bạn có chắc muốn xoá kí hiệu này?"
            onConfirm={() => handleDelete(topic.id)}
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
        <Header title="Chủ đề" subTitle="Danh sách chủ đề" />

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
                  onClick={() => navigate("/topic/add")}
                >
                  Thêm chủ đề
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
    </>
  );
};

export default Topic;

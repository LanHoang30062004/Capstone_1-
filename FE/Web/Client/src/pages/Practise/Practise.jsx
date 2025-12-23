import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Pagination,
  Row,
  Tag,
} from "antd";
import { CiSearch } from "react-icons/ci";
import { MdAccessTime } from "react-icons/md";
import { MdOutlineQuiz } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import "./Practise.scss";
import { useEffect, useState } from "react";
import * as topicService from "~/service/topicService";

const Practise = () => {
  const [topics, setTopics] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (value) => {
    const searchObject = Object.fromEntries(searchParams.entries());
    setSearchParams({
      ...searchObject,
      page: 1,
      content: value.content,
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

  useEffect(() => {
    const searchObject = Object.fromEntries(searchParams.entries());

    searchObject.page = searchObject.page ? parseInt(searchObject.page) : 1;
    searchObject.size = searchObject.size ? parseInt(searchObject.size) : 10;

    const fetchTopic = async (searchObject) => {
      const response = await topicService.getTopic(searchObject);

      setTopics(response);
    };

    fetchTopic(searchObject);
  }, [searchParams]);

  return (
    <>
      <section className="practise mt">
        <div className="container">
          <div className="practise__inner">
            <div className="practise__head">
              <h1 className="practise__title">Ngân hàng câu hỏi</h1>
              <Form onFinish={handleSearch}>
                <Form.Item name="content">
                  <Input
                    size="large"
                    placeholder="Tìm kiếm..."
                    prefix={<CiSearch />}
                  />
                </Form.Item>
              </Form>
            </div>

            <div className="practise__body">
              <Row gutter={[30, 30]}>
                {topics?.items?.length > 0 &&
                  topics.items.map((item) => (
                    <Col key={item.id} xl={6} lg={8} md={12} sm={24} xs={24}>
                      <Card className="practise__card">
                        <h3 className="practise__card--title">
                          {item.content}
                        </h3>

                        <Flex align="center" justify="space-between">
                          <div className="practise__card--info">
                            <MdAccessTime className="practise__card--icon" />
                            <span>{item.durationMinutes} phút</span>
                          </div>

                          <div className="practise__card--info">
                            <MdOutlineQuiz className="practise__card--icon" />
                            <span>{item.numberOfQuestion} câu hỏi</span>
                          </div>
                        </Flex>

                        <Link
                          to={`/practise/${item.id}`}
                          className="practise__card--btn"
                        >
                          <Button size="large" variant="outlined">
                            Chi tiết
                          </Button>
                        </Link>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </div>

            <Pagination
              className="practise__pagination"
              align="center"
              defaultCurrent={1}
              total={topics?.pageSize * topics?.totalPages}
              onChange={handleChangePage}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Practise;

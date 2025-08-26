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
import { Link } from "react-router-dom";
import "./Practise.scss";

const Practise = () => {
  return (
    <>
      <section className="practise mt">
        <div className="container">
          <div className="practise__inner">
            <div className="practise__head">
              <h1 className="practise__title">Ngân hàng câu hỏi</h1>
              <div className="practise__topic">
                <div className="practise__topic--item active">Tất cả</div>
                <div className="practise__topic--item">Đồ ăn</div>
                <div className="practise__topic--item">Gia đình</div>
                <div className="practise__topic--item">Ngày lễ</div>
                <div className="practise__topic--item">Nghề nghiệp</div>
                <div className="practise__topic--item">Đạo đức</div>
                <div className="practise__topic--item">Gia vị</div>
              </div>

              <Form>
                <Form.Item name="search">
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
                <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                  <Card className="practise__card">
                    <h3 className="practise__card--title">Động vật</h3>
                    <Flex align="center" justify="space-between">
                      <div className="practise__card--info">
                        <MdAccessTime className="practise__card--icon" />
                        <span>10 phút</span>
                      </div>

                      <div className="practise__card--info">
                        <MdOutlineQuiz className="practise__card--icon" />
                        <span>15 câu hỏi</span>
                      </div>
                    </Flex>

                    <div className="practise__card--did">100 lượt làm</div>

                    <div className="practise__card--tag">
                      <Tag bordered={false} color="cyan">
                        Động vật
                      </Tag>
                    </div>

                    <Link
                      to={`/practise/dong-vat`}
                      className="practise__card--btn"
                    >
                      <Button size="large" variant="outlined">
                        Chi tiết
                      </Button>
                    </Link>
                  </Card>
                </Col>

                <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                  <Card className="practise__card">
                    <h3 className="practise__card--title">Động vật</h3>
                    <Flex align="center" justify="space-between">
                      <div className="practise__card--info">
                        <MdAccessTime className="practise__card--icon" />
                        <span>10 phút</span>
                      </div>

                      <div className="practise__card--info">
                        <MdOutlineQuiz className="practise__card--icon" />
                        <span>15 câu hỏi</span>
                      </div>
                    </Flex>

                    <div className="practise__card--did">100 lượt làm</div>

                    <div className="practise__card--tag">
                      <Tag bordered={false} color="cyan">
                        Động vật
                      </Tag>
                    </div>

                    <Link
                      to={`/practise/dong-vat`}
                      className="practise__card--btn"
                    >
                      <Button size="large" variant="outlined">
                        Chi tiết
                      </Button>
                    </Link>
                  </Card>
                </Col>

                <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                  <Card className="practise__card">
                    <h3 className="practise__card--title">Động vật</h3>
                    <Flex align="center" justify="space-between">
                      <div className="practise__card--info">
                        <MdAccessTime className="practise__card--icon" />
                        <span>10 phút</span>
                      </div>

                      <div className="practise__card--info">
                        <MdOutlineQuiz className="practise__card--icon" />
                        <span>15 câu hỏi</span>
                      </div>
                    </Flex>

                    <div className="practise__card--did">100 lượt làm</div>

                    <div className="practise__card--tag">
                      <Tag bordered={false} color="cyan">
                        Động vật
                      </Tag>
                    </div>

                    <Link
                      to={`/practise/dong-vat`}
                      className="practise__card--btn"
                    >
                      <Button size="large" variant="outlined">
                        Chi tiết
                      </Button>
                    </Link>
                  </Card>
                </Col>

                <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                  <Card className="practise__card">
                    <h3 className="practise__card--title">Động vật</h3>
                    <Flex align="center" justify="space-between">
                      <div className="practise__card--info">
                        <MdAccessTime className="practise__card--icon" />
                        <span>10 phút</span>
                      </div>

                      <div className="practise__card--info">
                        <MdOutlineQuiz className="practise__card--icon" />
                        <span>15 câu hỏi</span>
                      </div>
                    </Flex>

                    <div className="practise__card--did">100 lượt làm</div>

                    <div className="practise__card--tag">
                      <Tag bordered={false} color="cyan">
                        Động vật
                      </Tag>
                    </div>

                    <Link
                      to={`/practise/dong-vat`}
                      className="practise__card--btn"
                    >
                      <Button size="large" variant="outlined">
                        Chi tiết
                      </Button>
                    </Link>
                  </Card>
                </Col>
              </Row>
            </div>

            <Pagination
              className="practise__pagination"
              align="center"
              defaultCurrent={1}
              total={50}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Practise;

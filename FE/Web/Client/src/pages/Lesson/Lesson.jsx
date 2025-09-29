import { Button, Card, Col, Pagination, Row } from "antd";
import "./Lesson.scss";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as flashcardService from "~/service/flashcardService";

const Lesson = () => {
  const [flashCards, setFlashCards] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

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

    if (Object.keys(searchObject).length === 0) {
      searchObject.page = 1;
      searchObject.size = 10;
    }

    searchObject.page = parseInt(searchObject.page);
    searchObject.size = parseInt(searchObject.size);

    const fetchFlashCard = async (searchObject) => {
      const response = await flashcardService.getFlashCard(searchObject);

      setFlashCards(response);
    };

    fetchFlashCard(searchObject);
  }, [searchParams]);

  return (
    <>
      <section className="lesson mt">
        <div className="container">
          <div className="lesson__inner">
            <div className="lesson__head">
              <h1 className="lesson__title">Chọn chủ đề học tập</h1>
              <p className="lesson__description">
                Bắt đầu hành trình học ngôn ngữ ký hiệu với các chủ đề thú vị và
                thực tế
              </p>
            </div>

            <Row gutter={[16, 16]}>
              {flashCards?.items?.length > 0 &&
                flashCards?.items?.map((item) => (
                  <Col xl={6} lg={8} md={12} sm={24} xs={24} key={item.id}>
                    <Card className="lesson__card">
                      <h3 className="lesson__card--title">{item.content}</h3>

                      <div className="lesson__card--footer">
                        <Button variant="outlined" color="primary" size="large">
                          <Link to={`/flashcard/${item.id}`}>Học ngay</Link>
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>

            <Pagination
              current={parseInt(searchParams.get("page")) || 1}
              className="lesson__pagination"
              total={flashCards?.totalPages * flashCards?.pageSize}
              align="center"
              onChange={handleChangePage}
              pageSize={flashCards?.pageSize || 10}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Lesson;

import { Button, Card, Col, Pagination, Popconfirm, Row } from "antd";
import "./Lesson.scss";
import { FaPlus } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "~/components/Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFlashCard,
  fetchFlashCardDelete,
} from "~/redux/flashCard/flashCardSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddFlashCard from "./AddFlashCard";
import { toast } from "react-toastify";

const Lesson = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [openAddFlashCard, setOpenAddFlashCard] = useState(false);
  const flashCards = useSelector((state) => state.flashCard.flashCards);

  const dispatch = useDispatch();

  const handleDeleteFlashCard = async (id) => {
    try {
      await toast.promise(dispatch(fetchFlashCardDelete(id)), {
        pending: "Đang xoá...",
      });

      const searchObject = Object.fromEntries(searchParams.entries());

      if (flashCards?.items.length === 1) {
        setSearchParams({
          ...searchObject,
          page: searchParams.get("page") - 1,
        });
      }
    } catch (err) {
      console.log(err);
    }
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

    if (Object.keys(searchObject).length === 0) {
      searchObject.page = 1;
      searchObject.size = 10;
    }

    searchObject.page = parseInt(searchObject.page);
    searchObject.size = parseInt(searchObject.size);

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      dispatch(
        fetchFlashCard({
          userId: userInfo?.id,
          query: searchObject,
        })
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  return (
    <>
      <section className="lesson mt">
        <div className="container">
          <div className="lesson__inner">
            <div className="lesson__head">
              <h1 className="lesson__title">Flashcard</h1>
              <p className="lesson__description">
                Bắt đầu hành trình học ngôn ngữ ký hiệu với các chủ đề thú vị và
                thực tế
              </p>
            </div>

            <h2 className="lesson__list">List từ đã tạo</h2>

            {loading ? (
              <Loading />
            ) : (
              <Row gutter={[16, 16]}>
                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                  <Card
                    className="lesson__card lesson__card--add"
                    onClick={() => setOpenAddFlashCard(true)}
                  >
                    <div className="lesson__card--icon">
                      <FaPlus />
                      <p>Tạo list từ</p>
                    </div>
                  </Card>
                </Col>

                {flashCards?.items?.length > 0 &&
                  flashCards?.items?.map((item) => (
                    <Col xl={6} lg={6} md={12} sm={12} xs={24} key={item.id}>
                      <Card className="lesson__card">
                        {/* Nút xóa góc trên bên phải */}
                        <Popconfirm
                          title="Xóa flashcard"
                          description="Bạn có chắc chắn muốn xóa list từ này không?"
                          onConfirm={() => handleDeleteFlashCard(item.id)} // hàm xóa bạn sẽ thêm
                          okText="Xóa"
                          cancelText="Hủy"
                          placement="topRight"
                        >
                          <RiDeleteBin6Line className="lesson__card--delete" />
                        </Popconfirm>

                        <h3 className="lesson__card--title">{item.content}</h3>

                        <div className="lesson__card--footer">
                          <Button type="primary" size="large">
                            <Link to={`/flashcard/detail/${item.id}`}>
                              Xem chi tiết
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>
            )}

            <Pagination
              current={parseInt(searchParams.get("page")) || 1}
              className="lesson__pagination"
              total={flashCards?.totalPages * flashCards?.pageSize}
              align="center"
              onChange={handleChangePage}
              pageSize={flashCards?.pageSize || 10}
              pageSizeOptions={[5, 10, 20, 50]}
            />

            {openAddFlashCard && (
              <AddFlashCard
                open={openAddFlashCard}
                setOpen={setOpenAddFlashCard}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Lesson;

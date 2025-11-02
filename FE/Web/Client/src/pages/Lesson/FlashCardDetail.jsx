import { Button, Card, Col, Popconfirm, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  fetchFlashCardDetail,
  fetchFlashCardEdit,
} from "~/redux/flashCard/flashCardSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditFlashCard from "./EditFlashCard";
import { toast } from "react-toastify";

const FlashCardDetail = () => {
  const flashCard = useSelector((state) => state.flashCard.flashCardDetail);
  const [openEditFlashCard, setOpenEditFlashCard] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const { id } = useParams();

  const dispatch = useDispatch();

  const handleDelete = async (value) => {
    try {
      toggleLoading(true);

      const data = {
        ...flashCard,
        cards: flashCard.cards.filter((item) => item.result !== value),
      };

      await dispatch(fetchFlashCardEdit({ id: id, data: data })).unwrap();

      dispatch(fetchFlashCardDetail(id));
    } catch (error) {
      toast.error(error);
    } finally {
      toggleLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchFlashCardDetail(id));
  }, [id, dispatch]);

  return (
    <>
      <div className="flashcards__detail container">
        <div className="flashcards__title">
          <Space>
            <h1>Flashcards: {flashCard?.content}</h1>
            <Button
              loading={loading}
              type="primary"
              onClick={() => setOpenEditFlashCard(true)}
            >
              Chỉnh sửa
            </Button>

            <Button variant="outlined" color="primary">
              <Link to={`/flashcard/${id}`}>Học ngay</Link>
            </Button>
          </Space>
        </div>

        <p className="flashcards__number">
          List có {flashCard?.cards?.length} từ
        </p>

        <div className="flashcards__items">
          <Row gutter={[16, 16]}>
            {flashCard?.cards?.length > 0 &&
              flashCard.cards.map((content) => (
                <Col span={24} key={content.result}>
                  <Card className="termlist-item">
                    <h3 className="termlist-item__title">{content.result}</h3>
                    <video
                      src={content.videoUrl}
                      autoPlay
                      loop
                      muted
                      width={300}
                    ></video>

                    <div className="termlist-item__delete">
                      <Popconfirm
                        title="Xoá từ này"
                        description="Bạn có chắc muốn xoá từ này?"
                        onConfirm={() => handleDelete(content.result)}
                        okText="Xoá"
                        cancelText="Huỷ"
                      >
                        <RiDeleteBin6Line className="icon" />
                      </Popconfirm>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      </div>

      {openEditFlashCard && (
        <EditFlashCard
          open={openEditFlashCard}
          setOpen={setOpenEditFlashCard}
        />
      )}
    </>
  );
};

export default FlashCardDetail;

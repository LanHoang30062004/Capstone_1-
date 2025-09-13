import { Button, Card, Col, Popconfirm, Row, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "~/components/Header/Header";
import {
  fetchFlashCardDetail,
  fetchFlashCardEdit,
} from "~/redux/flashCard/flashCardSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditFlashCard from "./EditFlashCard";
import { LoadingContext } from "~/context/LoadingContext";
import { toast } from "react-toastify";

const FlashCardDetail = () => {
  const flashCard = useSelector((state) => state.flashCard.flashCardDetail);
  const [openEditFlashCard, setOpenEditFlashCard] = useState(false);
  const { loading, toggleLoading } = useContext(LoadingContext);
  const { id } = useParams();

  const dispatch = useDispatch();

  const handleDelete = async (value) => {
    try {
      toggleLoading(true);

      const data = {
        ...flashCard,
        cards: flashCard.cards.filter((item) => item.result !== value),
      };

      const response = await dispatch(
        fetchFlashCardEdit({ id: 1, data: data })
      ).unwrap();

      toast.success("Thêm thành công!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      toggleLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchFlashCardDetail(id));
  }, [id, dispatch]);

  return (
    <>
      <div className="flash-card__detail contain">
        <Header title="Chi tiết Flash Card" subTitle="Danh sách flash card" />
        <div className="flash-card__title">
          <Space>
            <h1>Flashcards: {flashCard?.content}</h1>
            <Button type="primary" onClick={() => setOpenEditFlashCard(true)}>
              Chỉnh sửa
            </Button>
            <Button type="primary">Thêm từ mới</Button>
          </Space>
        </div>

        <p className="flash-card__number">List có 31 từ</p>

        <div className="flash-card__items">
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

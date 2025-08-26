import { Button, Card, Flex, Select, Tag } from "antd";
import { MdAccessTime } from "react-icons/md";
import { MdOutlineQuiz } from "react-icons/md";

const options = Array.from({ length: 12 }, (_, i) => {
  const value = (i + 1) * 5;
  return {
    value: value,
    label: `${value} phút`,
  };
});

const PractiseDetail = () => {
  return (
    <>
      <section className="practise-detail mt">
        <div className="container">
          <div className="practise-detail__inner">
            <Card className="practise-detail__card">
              <Flex vertical gap={20}>
                <div className="practise-detail__tag">
                  <Tag color="cyan">Động vật</Tag>'
                </div>

                <h2 className="practise-detail__title">Động vật</h2>

                <div className="practise-detail__btn btn">
                  Thông tin bài luyện
                </div>

                <div className="practise-detail__info">
                  <div className="practise-detail__info">
                    <MdAccessTime className="practise-detail__info--icon" />{" "}
                    Thời gian làm bài: 15 phút | 30 câu hỏi
                  </div>

                  <div>
                    <MdOutlineQuiz className="practise-detail__info--icon" />{" "}
                    12832123 người đã luyện tập đề này
                  </div>
                </div>

                <div className="practise-detail__time">
                  <Select
                    className="full-width"
                    defaultValue={5}
                    options={options}
                  ></Select>
                </div>

                <div>
                  <Button type="primary">Luyện tập</Button>
                </div>
              </Flex>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default PractiseDetail;

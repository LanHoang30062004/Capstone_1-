import { Button, Modal } from "antd";
import Background from "~/assets/images/Bg2.png";
import "./LessonContent.scss";

const LessonModal = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <>
      <Modal
        className="lesson__modal modal"
        open={isModalOpen}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setIsModalOpen(false)}
            className="lesson__modal--btn"
          >
            Đóng
          </Button>,
        ]}
        closable={false}
      >
        <div className="lesson__modal--head">
          <h3 className="lesson__modal--title">Địa chỉ</h3>
        </div>

        <div className="lesson__modal--body">
          <p className="lesson__modal--description">
            Những thông tin cụ thể về chỗ ở, nơi làm việc của một người, một cơ
            quan, v.v.
          </p>

          <img src={Background} alt="" />
        </div>
      </Modal>
    </>
  );
};

export default LessonModal;

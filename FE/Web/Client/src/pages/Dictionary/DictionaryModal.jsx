import { Button, Modal } from "antd";
import Background from "~/assets/images/Bg2.png";

const DictionaryModal = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <>
      <Modal
        className="dictionary__modal"
        open={isModalOpen}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setIsModalOpen(false)}
            className="dictionary__modal--btn"
          >
            Đóng
          </Button>,
        ]}
        closable={false}
      >
        <div className="dictionary__modal--head">
          <h3 className="dictionary__modal--title">Địa chỉ</h3>
        </div>

        <div className="dictionary__modal--body">
          <p className="dictionary__modal--description">
            Những thông tin cụ thể về chỗ ở, nơi làm việc của một người, một cơ
            quan, v.v.
          </p>

          <img src={Background} alt="" />
        </div>
      </Modal>
    </>
  );
};

export default DictionaryModal;

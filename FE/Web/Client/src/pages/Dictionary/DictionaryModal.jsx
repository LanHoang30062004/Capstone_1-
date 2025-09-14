import { Button, Modal } from "antd";
const DictionaryModal = ({ isModalOpen, setIsModalOpen, word }) => {
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
          <h3 className="dictionary__modal--title">{word?.wordName}</h3>
        </div>

        <div className="dictionary__modal--body">
          <p className="dictionary__modal--description">{word?.wordMeaning}</p>

          <video src={word?.videoUrl} controls autoPlay />
        </div>
      </Modal>
    </>
  );
};

export default DictionaryModal;

import { Modal } from "antd";
import React from "react";

const DetailPosition = (props) => {
  const { open, setOpen, position } = props;

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Chi tiết phòng ban</h4>}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <p>
          <span className="modal__label">Mã vị trí:</span> {position.positionID}
        </p>
        <p>
          <span className="modal__label">Tên vị trí:</span>{" "}
          {position.positionName}
        </p>
      </Modal>
    </>
  );
};

export default DetailPosition;

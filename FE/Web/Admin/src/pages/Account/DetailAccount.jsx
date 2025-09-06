import { Modal } from "antd";
import React from "react";

const DetailAccount = (props) => {
  const { open, setOpen, account } = props;

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Chi tiết phòng ban</h4>}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <p>
          <span className="modal__label">Họ tên:</span> {account?.fullName}
        </p>
        <p>
          <span className="modal__label">Email:</span> {account?.email}
        </p>
        <p>
          <span className="modal__label">Ngày sinh:</span>{" "}
          {account?.dateOfBirth}
        </p>
        <p>
          <span className="modal__label">Vai trò:</span> {account?.role}
        </p>
      </Modal>
    </>
  );
};

export default DetailAccount;

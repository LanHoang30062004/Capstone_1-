import { Modal } from "antd";
import React from "react";

const DetailAccount = (props) => {
  const { open, setOpen, account } = props;

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Thông tin chi tiết</h4>}
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <p>
          <span className="modal__label">Mã tài khoản:</span> {account.id}
        </p>

        <p>
          <span className="modal__label">Tên:</span> {account.fullName}
        </p>

        <p>
          <span className="modal__label"> Ngày sinh:</span>{" "}
          {account.dateOfBirth}
        </p>

        <p>
          <span className="modal__label"> Giới tính:</span> {account.gender}
        </p>

        <p>
          <span className="modal__label"> Số điện thoại:</span>{" "}
          {account.phoneNumber}
        </p>

        <p>
          <span className="modal__label"> Email:</span> {account.email}
        </p>

        <p>
          <span className="modal__label"> Địa chỉ:</span> {account.address}
        </p>
      </Modal>
    </>
  );
};

export default DetailAccount;

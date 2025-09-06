import { Modal } from "antd";

const DetailEmployee = (props) => {
  const { open, setOpen, employee } = props;

  return (
    <>
      <Modal
        title={<h4 className="modal__title">Thông tin chi tiết</h4>}
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <p>
          <span className="modal__label">Mã nhân viên:</span>{" "}
          {employee.employeeID}
        </p>

        <p>
          <span className="modal__label">Tên:</span> {employee.fullName}
        </p>

        <p>
          <span className="modal__label"> Ngày sinh:</span>{" "}
          {employee.dateOfBirth}
        </p>

        <p>
          <span className="modal__label"> Giới tính:</span> {employee.gender}
        </p>

        <p>
          <span className="modal__label"> Số điện thoại:</span>{" "}
          {employee.phoneNumber}
        </p>

        <p>
          <span className="modal__label"> Email:</span> {employee.email}
        </p>

        <p>
          <span className="modal__label"> Ngày vào làm:</span>{" "}
          {employee.hireDate}
        </p>

        <p>
          <span className="modal__label">Phòng ban:</span>{" "}
          {employee.departmentID}
        </p>

        <p>
          <span className="modal__label">Vị trí:</span>{" "}
          {employee.positionID}
        </p>

        <p>
          <span className="modal__label">Trạng thái:</span>{" "}
          {employee.status}
        </p>
      </Modal>
    </>
  );
};

export default DetailEmployee;

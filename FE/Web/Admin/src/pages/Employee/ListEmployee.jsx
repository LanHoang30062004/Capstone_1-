import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Pagination,
  Popconfirm,
  Select,
  Table,
  Tag,
} from "antd";
import Header from "~/components/Header/Header";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import "./Employee.css";
import { Link, useSearchParams } from "react-router-dom";
import DetailEmployee from "~/pages/Employee/DetailEmployee";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const columns = [
  { title: "Mã nhân viên", dataIndex: "employeeID" },
  { title: "Tên nhân viên", dataIndex: "fullName" },
  { title: "Ngày vào làm", dataIndex: "hireDate" },
  { title: "Phòng ban", dataIndex: "departmentName" },
  { title: "Vị trí", dataIndex: "positionName" },
  { title: "Trạng thái", dataIndex: "status" },
  { title: "Hành động", dataIndex: "action" },
];

const ListEmployee = () => {
  const [openDetail, setOpenDetail] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // const optionsDepartment = [
  //   { value: "", label: "Tất cả" },
  //   ...departments.map((department) => ({
  //     value: department.departmentName,
  //     label: department.departmentName,
  //   })),
  // ];

  // const optionsPosition = [
  //   { value: "", label: "Tất cả" },
  //   ...positions.map((position) => ({
  //     value: position.positionName,
  //     label: position.positionName,
  //   })),
  // ];

  const dispatch = useDispatch();

  const handleDelete = (employeeID) => {
    const searchObject = Object.fromEntries(searchParams.entries());

    if (employees.currentEmployee.length === 1) {
      setSearchParams({
        ...searchObject,
        PageNumber: searchParams.get("PageNumber") - 1,
      });
    }
  };

  const handleSearch = (value) => {
    const searchObject = Object.fromEntries(searchParams.entries());
    console.log(value);

    setSearchParams({
      ...searchObject,
      employeeFind: value.search,
    });
  };

  const handleChangePage = (page) => {
    const searchObject = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...searchObject,
      PageNumber: page,
    });
  };

  const handleFilterDepartment = (value) => {
    const searchObject = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...searchObject,
      departmentFind: value,
    });
  };

  const handleFilterPosition = (value) => {
    const searchObject = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...searchObject,
      positionFind: value,
    });
  };

  const handleOpenModal = (openModal, employee) => {
    openModal(true);
    setEmployee(employee);
  };

  // useEffect(() => {
  //   const searchObject = Object.fromEntries(searchParams.entries());

  //   dispatch(fetchEmployeeGetAllApi(searchObject));
  // }, [dispatch, searchParams]);

  // useEffect(() => {
  //   dispatch(fetchDepartmentGetApi());
  //   dispatch(fetchPositionGetApi());
  // }, [dispatch]);

  // const dataSource = employees.currentEmployee.map((employee) => ({
  //   key: employee.employeeID,
  //   employeeID: employee.employeeID,
  //   fullName: employee.fullName,
  //   hireDate: employee.hireDate,
  //   departmentName: employee.departmentName,
  //   positionName: employee.positionName,
  //   status: (
  //     <Tag
  //       color={employee.status == "Đang làm" ? "success" : "red"}
  //       bordered={false}
  //     >
  //       {employee.status}
  //     </Tag>
  //   ),
  //   action: (
  //     <Flex align="center" gap="small">
  //       <EyeOutlined
  //         className="table__icon"
  //         onClick={() => handleOpenModal(setOpenDetail, employee)}
  //       />
  //       <Link to={`edit/${employee.employeeID}`}>
  //         <EditOutlined className="table__icon" />
  //       </Link>
  //       <Popconfirm
  //         title="Xoá nhân viên"
  //         description="Bạn có chắc muốn xoá nhân viên này?"
  //         onConfirm={() => handleDelete(employee.employeeID)}
  //         okText="Xoá"
  //         cancelText="Huỷ"
  //       >
  //         <DeleteOutlined className="table__icon" />
  //       </Popconfirm>
  //     </Flex>
  //   ),
  // }));

  return (
    <>
      <div className="employee__list contain">
        <Header title="Nhân viên" subTitle="Danh sách nhân viên" />

        <Card className="employee__table table">
          <div className="employee__table--head">
            <Flex align="center" justify="space-between">
              <div className="employee__search">
                <Flex align="center" gap="small">
                  <Form onFinish={handleSearch}>
                    <Form.Item name="search">
                      <Input
                        placeholder="Tìm kiếm"
                        prefix={<SearchOutlined className="table__icon" />}
                        className="table__search"
                      />
                    </Form.Item>
                  </Form>

                  <Select
                    onChange={handleFilterDepartment}
                    style={{ minWidth: 100 }}
                    placeholder="Lọc theo phòng ban"
                  />

                  <Select
                    onChange={handleFilterPosition}
                    style={{ minWidth: 100 }}
                    placeholder="Lọc theo vị trí"
                  />
                </Flex>
              </div>

              <div className="employee__action">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                >
                  <Link to="add">Thêm nhân viên</Link>
                </Button>
              </div>
            </Flex>
          </div>

          <Table
            columns={columns}
            style={{ marginTop: 20, marginBottom: 20 }}
            pagination={false}
          />

          <Pagination
            current={parseInt(searchParams.get("PageNumber")) || 1}
            total={50}
            align="end"
            showTotal={(total) => `Tổng: ${total} nhân viên`}
            onChange={handleChangePage}
          />
        </Card>
      </div>

      {openDetail && (
        <DetailEmployee
          open={openDetail}
          setOpen={setOpenDetail}
          employee={employee}
        />
      )}
    </>
  );
};

export default ListEmployee;

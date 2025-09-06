import instance from "~/api/intance";

const getOwnSalary = async (employeeId) => {
  const response = await instance.get(
    `/Salary/GetSalaryByEmployeeId/${employeeId}`
  );

  return response.data;
};

const salaryService = {
  getOwnSalary,
};

export default salaryService;

import instance from "~/api/intance";

const getReportEmployee = async () => {
  const response = await instance.get('/reports/employee-count');

  return response.data;
}

const getAverageSalary = async () => {
  const response = await instance.get('/reports/average-salary-by-department');

  return response.data;
}

const reportService = {
  getReportEmployee,
  getAverageSalary,
}

export default reportService;



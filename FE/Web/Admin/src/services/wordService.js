import instance from "~/api/intance";

const uploadVideo = async (data) => {
  const response = await instance.post('/word/upload', data)

  return response.data
}

const getAverageSalary = async () => {
  const response = await instance.get('/reports/average-salary-by-department');

  return response.data;
}

const wordService = {
  uploadVideo,
  getAverageSalary,
}

export default wordService;



import instance from "~/api/intance";

const login = async (data) => {
  const response = await instance.post(`/user/login`, data);

  return response.data;
};

const accountService = {
  login,
};

export default accountService;

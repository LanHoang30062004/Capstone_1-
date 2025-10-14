import instance from "~/api/intance";

const login = async (data) => {
  const response = await instance.post(`/user/login`, data);

  return response.data;
};

const logout = () => {
  localStorage.removeItem('adminAccessToken')
  localStorage.removeItem('userInfo')

  location.href = '/login'
};

const getUser = async (query) => {
  const response = await instance.get(`/user/email`, {
    params: query
  });

  return response.data;
};

const accountService = {
  login,
  getUser,
  logout
};

export default accountService;

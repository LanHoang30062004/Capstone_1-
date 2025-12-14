import instance from "~/api/intance";

const login = async (data) => {
  const response = await instance.post(`/user/login`, data);

  return response.data;
};

const logout = () => {
  localStorage.removeItem('adminAccessToken')
  localStorage.removeItem('adminInfo')

  location.href = '/login'
};

const getUser = async (query) => {
  const response = await instance.get(`/user/email`, {
    params: query
  });

  return response.data;
};

const getUserById = async (id) => {
  const response = await instance.get(`/user/${id}`);

  return response.data;
};

const editAccount = async (data) => {
  const response = await instance.put(`/user`, data)

  return response.data
}

const accountService = {
  login,
  getUser,
  logout,
  getUserById,
  editAccount
};

export default accountService;

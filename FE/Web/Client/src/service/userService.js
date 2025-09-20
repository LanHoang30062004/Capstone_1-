import instance from "~/api/intance"

export const register = async (data) => {
  const response = await instance.post('/user/register', data)

  return response.data
}

export const login = async (data) => {
  const response = await instance.post('/user/login', data)

  return response.data
}

export const forgot = async (data) => {
  const response = await instance.post(`/password/forgot?email=${data}`, data)

  return response.data
}

export const checkOtp = async (data) => {
  const response = await instance.post('/password/check', data)

  return response.data
}

export const changePass = async (data) => {
  const response = await instance.post('/password/change', data)

  return response.data
}

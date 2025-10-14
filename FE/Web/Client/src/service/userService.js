import axios from "axios"
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
  const response = await instance.post(`/password/forgot`, null, { params: { email: data.email } })

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

export const loginGoogle = async () => {
  const response = await axios.post('http://localhost:8080/oauth2/authorization/google?state=web')

  return response.data
}

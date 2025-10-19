import axios from "axios"
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
  timeout: 10 * 60 * 1000
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const accessToken = localStorage.getItem("accessToken");


  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  // if (error.response?.status === 401) {
  //   accountService.logout();
  // }
  const originalRequest = error.config

  if (error.response?.status === 410 && !originalRequest._retry) {
    originalRequest._retry = true;

    // return accountService.refreshToken(refreshToken)
    //   .then((res) => {
    //     // Lấy accessToken gắn lại localStorage
    //     const { accessToken } = res.data;

    //     localStorage.setItem("accessToken", accessToken);
    //     instance.defaults.headers.Authorization = `Bearer ${accessToken}`;

    //     return instance(originalRequest);
    //   })
    //   .catch((err) => {
    //     accountService.logout();

    //     return Promise.reject(err);
    //   })
  }
  console.log(error.response)
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error.response?.message || error?.message);
  }

  return Promise.reject(error);
});

export default instance
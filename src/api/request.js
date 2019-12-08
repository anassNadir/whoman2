import axios from "axios";
import { Message } from "element-ui";

const service = axios.create({
  baseURL: "",
  timeout: 5000
});

service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.data) {
      const msg = error.response.data.message;
      Message({
        message: msg,
        type: "error",
        duration: 5 * 1000
      });
    } else {
      Message({
        message: error.message,
        type: "error",
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;

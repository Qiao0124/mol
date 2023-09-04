import axios, { AxiosResponse } from "axios";
import { useMolStore } from "@/store";
const molStore = useMolStore();

const getCookie = (name: string, token: string) => {
  const value = "; " + token;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return;
};

const requests = axios.create({
  // baseURL: process.env.NODE_ENV === 'production' ? `/` : '/api',
  baseURL: "/",
  // 是否跨站点访问控制请求
  //withCredentials: true,
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true;
  },
});

requests.interceptors.request.use(
  (config) => {
    // 在post请求前统一添加X-CSRFToken的header信息
    if (config.method == "post") {
      const csrfToken = molStore.getCsrfToken();
      document.cookie = "csrftoken=" + csrfToken;
      config.headers["X-CSRFToken"] = csrfToken;
      console.log("csrf-token", csrfToken);
    }
    return config;
  },
  (error) =>
    // Do something with request error
    Promise.reject(error)
);

export default requests;

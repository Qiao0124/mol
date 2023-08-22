import axios from "axios";

const requests = axios.create({
  // baseURL: process.env.NODE_ENV === 'production' ? `/` : '/api',
  baseURL: "http://localhost:8000",
  // 是否跨站点访问控制请求
  //withCredentials: true,
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true;
  },
});

export default requests;

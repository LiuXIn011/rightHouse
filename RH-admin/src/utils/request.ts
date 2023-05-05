import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-vue'
import useUserStore from '@/stores/user'
// 定义返回值类型
declare module 'axios' {
  interface AxiosResponse<T = any> {
    status: number
    count?: number
    data: T
    message?: number | string
  }
  export function create (config?: AxiosRequestConfig): AxiosInstance;
}
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
})
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status !== 1) {
      Message.error(res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    if (
      error &&
      error.response &&
      error.response.status === 401
    ) {
      const userStore = useUserStore()
      Message.error('登录过期，请重新登陆！')
      userStore.logOut()
    } else {
      Message.error('系统异常！')
    }
    return Promise.reject(error)
  }
)

export default service

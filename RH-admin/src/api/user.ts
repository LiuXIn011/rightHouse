import axios from '@/utils/request';

interface loginType {
  phone: string | number
  password: string | number
}
export const login = (data: loginType) => axios({
  url: '/api/adminUser/login',
  method: 'post',
  data
})
export const getUserInfo = () => axios({
  url: '/api/adminUser/getUserInfo',
  method: 'get'
})

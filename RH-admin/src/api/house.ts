import axios from '@/utils/request';

export const getHouseList = (params: any) => axios({
  url: '/api/house/list',
  method: 'get',
  params
})
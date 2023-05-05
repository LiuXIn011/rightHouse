import axios from '@/utils/request';

export const landlordListUser = (params: any) => axios({
  url: '/api/landlordUser/list',
  method: 'get',
  params
})
export const updateLandlordUser = (data: any) => axios({
  url: '/api/landlordUser/updateStatus',
  method: 'post',
  data
})

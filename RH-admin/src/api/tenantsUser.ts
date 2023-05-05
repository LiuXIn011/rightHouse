import axios from '@/utils/request';

export const tenantsListUser = (params: any) => axios({
  url: '/api/tenantsUser/list',
  method: 'get',
  params
})
export const updateLandlordUserStatus = (data: any) => axios({
  url: '/api/tenantsUser/updateStatus',
  method: 'post',
  data
})

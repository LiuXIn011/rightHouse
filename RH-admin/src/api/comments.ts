import axios from '@/utils/request';

export const getComments = (params: any) => axios({
  url: '/api/comments/getList',
  method: 'get',
  params
})
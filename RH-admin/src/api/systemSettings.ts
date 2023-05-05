import axios from '@/utils/request';

export const updateOssOrgin = (params: any) => axios({
  url: '/api/file/updateFileOrgin',
  method: 'get',
  params
})
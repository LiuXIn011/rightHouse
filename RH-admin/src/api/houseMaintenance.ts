import axios from '@/utils/request';

export const gethouseMaintenanceList = (params: any) => axios({
  url: '/api/houseMaintenance/list',
  method: 'get',
  params
})
import axios from '@/utils/request';

export const getHouseList = (params: any) => axios({
  url: '/api/house/list',
  method: 'get',
  params
})
export const getRentalMarketList = (params: any) => axios({
  url: '/api/rentalMarket/list',
  method: 'get',
  params
})
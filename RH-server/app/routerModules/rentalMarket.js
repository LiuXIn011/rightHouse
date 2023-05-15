'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/rentalMarket/insert', jwt, controller.rentalMarket.insert);
  router.post('/api/rentalMarket/updateStatus', jwt, controller.rentalMarket.updateStatus);
  router.get('/api/rentalMarket/list', controller.rentalMarket.list);
  router.get('/api/rentalMarket/selectById', jwt, controller.rentalMarket.selectById);
  router.get('/api/rentalMarket/starHouse', jwt, controller.rentalMarket.starHouse);
  router.get('/api/rentalMarket/tenantStarHouseList', jwt, controller.rentalMarket.tenantStarHouseList);
  router.post('/api/rentalMarket/updateStarStatus', jwt, controller.rentalMarket.updateStarStatus);
  router.get('/api/rentalMarket/selectByLandlordId', jwt, controller.rentalMarket.selectByLandlordId);
};

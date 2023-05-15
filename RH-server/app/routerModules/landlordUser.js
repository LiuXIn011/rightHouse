'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/api/landlordUser/list', jwt, controller.landlordUser.list);
  router.get('/api/landlordUser/selectById', jwt, controller.landlordUser.selectById);
  router.get('/api/landlordUser/loginByWx', controller.landlordUser.loginByWx);
  router.get('/api/landlordUser/sendMessage', jwt, controller.landlordUser.sendMessage);
  router.post('/api/landlordUser/update', jwt, controller.landlordUser.update);
  router.post('/api/landlordUser/updateStatus', jwt, controller.landlordUser.updateStatus);
  router.get('/api/landlordUser/getMaintenanceListByLandlordId', jwt, controller.landlordUser.getMaintenanceListByLandlordId);
  router.get('/api/landlordUser/selectByHouseId', jwt, controller.landlordUser.selectByHouseId);
  router.get('/api/landlordUser/getRentalMarketAndCommentsByLandlordId', jwt, controller.landlordUser.getRentalMarketAndCommentsByLandlordId);

};

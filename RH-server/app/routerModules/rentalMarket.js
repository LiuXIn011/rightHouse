'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/rentalMarket/insert', jwt, controller.rentalMarket.insert);
  router.post('/api/rentalMarket/updateStatus', jwt, controller.rentalMarket.updateStatus);
  router.get('/api/rentalMarket/list', jwt, controller.rentalMarket.list);
  router.get('/api/rentalMarket/selectById', jwt, controller.rentalMarket.selectById);
};

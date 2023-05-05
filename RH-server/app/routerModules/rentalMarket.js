'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/rentalMarket/insert', jwt, controller.rentalMarket.insert);
  router.post('/api/rentalMarket/updateStatus', jwt, controller.rentalMarket.updateStatus);
  router.get('/api/rentalMarket/list', controller.rentalMarket.list);
};

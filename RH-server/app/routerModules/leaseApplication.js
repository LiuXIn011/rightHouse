'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/leaseApplication/insert', jwt, controller.leaseApplication.insert);
  router.get('/api/leaseApplication/selectByLandlordId', jwt, controller.leaseApplication.selectByLandlordId);
  router.post('/api/leaseApplication/updateStatus', jwt, controller.leaseApplication.updateStatus);
};

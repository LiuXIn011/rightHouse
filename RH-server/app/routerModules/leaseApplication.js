'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/leaseApplication/insert', jwt, controller.leaseApplication.insert);
};

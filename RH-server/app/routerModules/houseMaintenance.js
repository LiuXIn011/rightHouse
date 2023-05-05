'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/api/houseMaintenance/list', jwt, controller.houseMaintenance.list);
};

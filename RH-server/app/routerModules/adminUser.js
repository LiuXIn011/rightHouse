'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/adminUser/login', controller.adminUser.login);
  router.get('/api/adminUser/getUserInfo', jwt, controller.adminUser.getUserInfo);
};

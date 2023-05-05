'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/api/tenantsUser/list', jwt, controller.tenantsUser.list);
  router.get('/api/tenantsUser/selectById', jwt, controller.tenantsUser.selectById);
  router.get('/api/tenantsUser/loginByWx', controller.tenantsUser.loginByWx);
  router.post('/api/tenantsUser/update', jwt, controller.tenantsUser.update);
  router.post('/api/tenantsUser/updateStatus', jwt, controller.tenantsUser.updateStatus);
  router.get('/api/tenantsUser/getHouseByTenantId', jwt, controller.tenantsUser.getHouseByTenantId);
  router.get('/api/tenantsUser/selectByMaintenanceId', controller.tenantsUser.selectByMaintenanceId);
  router.get('/api/landlordUser/getMaintenanceListByTenantId', jwt, controller.tenantsUser.getMaintenanceListByTenantId);
};

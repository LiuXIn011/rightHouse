'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/api/house/getCityCode', jwt, controller.house.getCityCode);
  router.post('/api/house/insert', jwt, controller.house.insert);
  router.get('/api/house/select', jwt, controller.house.select);
  router.get('/api/house/selectById', jwt, controller.house.selectById);
  router.post('/api/house/update', jwt, controller.house.update);
  router.get('/api/house/delete', jwt, controller.house.delete);
  router.get('/api/house/addTenants', jwt, controller.house.addTenants);
  router.get('/api/house/joinTenant', jwt, controller.house.joinTenant);
  router.get('/api/house/getTenantsByHouseId', jwt, controller.house.getTenantsByHouseId);
  router.post('/api/house/maintenance', jwt, controller.house.maintenance);
  router.get('/api/house/solveMaintenance', jwt, controller.house.solveMaintenance);
  router.post('/api/house/houseOut', jwt, controller.house.houseOut);
  router.get('/api/house/list', jwt, controller.house.list);

};

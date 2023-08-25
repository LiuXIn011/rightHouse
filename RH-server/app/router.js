'use strict';

const landlordUser = require('./routerModules/landlordUser');
const tenantsUser = require('./routerModules/tenantsUser');
const house = require('./routerModules/house');
const file = require('./routerModules/file');
const adminUser = require('./routerModules/adminUser');
const houseMaintenance = require('./routerModules/houseMaintenance');
const comments = require('./routerModules/comments');
const rentalMarket = require('./routerModules/rentalMarket');
const leaseApplication = require('./routerModules/leaseApplication');

module.exports = async app => {
  // 线上环境默认每次启动构建数据库
  if (app.config.env === 'prod') {
    // 初始化数据库 { force: true }重置
    app.model.sync({
      alter: true
    });
  }

  landlordUser(app);
  tenantsUser(app);
  file(app);
  house(app);
  adminUser(app);
  houseMaintenance(app);
  comments(app);
  rentalMarket(app);
  leaseApplication(app);
};

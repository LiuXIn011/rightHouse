'use strict';

const landlordUser = require('./routerModules/landlordUser');
const tenantsUser = require('./routerModules/tenantsUser');
const house = require('./routerModules/house');
const file = require('./routerModules/file');
const adminUser = require('./routerModules/adminUser');
const houseMaintenance = require('./routerModules/houseMaintenance');
const comments = require('./routerModules/comments');
const rentalMarket = require('./routerModules/rentalMarket');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = async app => {
  if (app.config.env === 'local') {
    // 初始化数据库 { force: true }重置
    // app.model.sync();
  }

  landlordUser(app);
  tenantsUser(app);
  file(app);
  house(app);
  adminUser(app);
  houseMaintenance(app);
  comments(app);
  rentalMarket(app);
};

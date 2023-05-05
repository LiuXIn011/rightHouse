'use strict';

const { Controller } = require('egg');
class HouseMaintenanceController extends Controller {
  async list() {
    const { ctx } = this;
    const data = ctx.query;
    const houseMaintenanceData = await ctx.service.houseMaintenance.list(data);
    ctx.body = {
      status: 1,
      count: houseMaintenanceData.count,
      data: houseMaintenanceData.rows
    };
  }
}
module.exports = HouseMaintenanceController;

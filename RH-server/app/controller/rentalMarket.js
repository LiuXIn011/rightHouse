// 添加
'use strict';

const { Controller } = require('egg');
class RentalMarketController extends Controller {
  async insert() {
    const { ctx } = this;
    const rules = {
      houseId: 'number',
      userId: 'number'
    };
    const data = ctx.request.body;
    const token = ctx.header.authorization;
    data.userId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    ctx.validate(rules, data);
    const rentalMarketObj = await ctx.service.rentalMarket.selectByHouseId(data.houseId);
    if (rentalMarketObj) {
      const updateRentalMarketStatus = await ctx.service.rentalMarket.updateStatus({
        id: rentalMarketObj.id,
        status: 1
      });
      ctx.body = {
        status: 1,
        data: updateRentalMarketStatus
      };
    } else {
      const insertRentalMarket = await ctx.service.rentalMarket.insert(data);
      ctx.body = {
        status: 1,
        data: insertRentalMarket
      };
    }


  }
  async updateStatus() {
    const { ctx } = this;
    const rules = {
      id: 'number',
      status: 'number'
    };
    ctx.validate(rules, ctx.request.body);

    const updateRentalMarketStatus = await ctx.service.rentalMarket.updateStatus(ctx.request.body);
    ctx.body = {
      status: 1,
      data: updateRentalMarketStatus
    };
  }
  async list() {
    const { ctx } = this;
    const list = await ctx.service.rentalMarket.list(ctx.query);
    ctx.body = {
      status: 1,
      data: list.rows,
      count: list.count
    };
  }
}
module.exports = RentalMarketController;


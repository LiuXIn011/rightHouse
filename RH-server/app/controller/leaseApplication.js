'use strict';

const { Controller } = require('egg');
class LeaseController extends Controller {
  async insert() {
    const { ctx } = this;
    const token = ctx.header.authorization;
    ctx.request.body.tenantId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const rules = {
      houseId: 'int',
      tenantId: 'int',
      rentalMarketId: 'int',
      landlordId: 'int'
    };
    ctx.validate(rules, ctx.request.body);
    const insertLease = await ctx.service.leaseApplication.insert(ctx.request.body);
    ctx.body = {
      status: 1,
      data: insertLease.id
    };
  }
  async selectByLandlordId() {
    const { ctx } = this;
    const token = ctx.header.authorization;
    const leaseData = await ctx.service.leaseApplication.list({
      landlordId: ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id
    });
    ctx.body = {
      status: 1,
      data: leaseData
    };
  }
  async updateStatus() {
    const { ctx } = this;
    const rules = {
      id: 'int',
      status: 'int'
    };
    ctx.validate(rules, ctx.request.body);
    let joinFlag = true;
    if (ctx.request.body.status === 1) {
      joinFlag = await ctx.service.house.joinTenant(ctx.request.body);
    }
    if (joinFlag) {
      const leaseData = await ctx.service.leaseApplication.updateStatus(ctx.request.body);
      ctx.body = {
        status: 1,
        data: leaseData
      };
    } else {
      ctx.body = {
        status: -1,
        message: '入住失败'
      };
    }


  }

}
module.exports = LeaseController;

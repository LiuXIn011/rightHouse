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
}
module.exports = LeaseController;

'use strict';
const { Controller } = require('egg');
class HouseController extends Controller {
  async insert() {
    const { ctx } = this;
    const data = ctx.request.body;
    const token = ctx.header.authorization;
    data.tenantId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    data.houseCommentImg = JSON.stringify(data.houseCommentImg);
    data.landlordCommentImg = JSON.stringify(data.landlordCommentImg);
    const insertComments = await ctx.service.comments.insert(data);
    ctx.body = {
      status: 1,
      data: insertComments
    };
  }
  async selectById() {
    const { ctx } = this;
    const id = ctx.query.id;
    const rule = {
      id: 'string'
    };
    ctx.validate(rule, ctx.request.query);
    const comment = await ctx.service.comments.selectById(id);
    ctx.body = {
      status: 1,
      data: comment
    };
  }
  async getList() {
    const { ctx } = this;
    const data = ctx.query;
    const commentsData = await ctx.service.comments.list(data);
    ctx.body = {
      status: 1,
      count: commentsData.count,
      data: commentsData.rows
    };
  }
}
module.exports = HouseController;

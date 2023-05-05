'use strict';

const { Controller } = require('egg');
class AdminUserController extends Controller {
  async login() {
    const { ctx } = this;
    const data = ctx.request.body;
    const userObj = await ctx.service.adminUser.login(data.phone);
    if (userObj) {
      if (userObj.status === 1) {
        if (userObj.password === data.password) {
          const userToken = ctx.app.jwt.sign({
            data: {
              id: userObj.id
            }
          }, ctx.app.config.jwt.secret);
          ctx.body = {
            status: 1,
            data: userToken
          };
        } else {
          ctx.body = {
            status: -1,
            data: '',
            message: '密码错误！'
          };
        }
      } else if (userObj.status === 2) {
        ctx.body = {
          status: -1,
          data: '',
          message: '用户已停用！'
        };
      } else {
        ctx.body = {
          status: -1,
          data: '',
          message: '未查询到用户！'
        };
      }
    } else {
      ctx.body = {
        status: -1,
        data: '',
        message: '未查询到用户！'
      };
    }

  }
  async getUserInfo() {
    const { ctx } = this;
    const token = ctx.header.authorization;
    const id = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const userObj = await ctx.service.adminUser.getUserInfo(id);
    if (userObj) {
      ctx.body = {
        status: 1,
        data: userObj
      };
    } else {
      ctx.body = {
        status: -1,
        data: '',
        message: '未查询到用户！'
      };
    }
  }
}
module.exports = AdminUserController;

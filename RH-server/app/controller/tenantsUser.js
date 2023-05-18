'use strict';

const { Controller } = require('egg');

class TenantsUserController extends Controller {
  // 获取用户列表
  async list() {
    const { ctx } = this;
    const data = ctx.query;
    const tenantsUser = await ctx.service.tenantsUser.list(data);
    ctx.body = {
      status: 1,
      count: tenantsUser.count,
      data: tenantsUser.rows
    };
  }
  // 获取用户详情
  async selectById() {
    const { ctx } = this;
    const token = ctx.header.authorization;
    const userId = ctx.query.id || ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const tenantsUser = await ctx.service.tenantsUser.selectById(userId);
    if (tenantsUser) {
      ctx.body = {
        status: 1,
        data: tenantsUser
      };
    } else {
      ctx.body = {
        status: -1,
        data: '',
        message: '未查询到用户'
      };
    }

  }
  // 获取用户id
  async getUserId(phone, jsCode, userType) {
    const { ctx } = this;
    const tenantsUser = await ctx.service.tenantsUser.selectByPhone(phone);
    if (tenantsUser) {
      return tenantsUser.id;
    }
    const wxLoginResult = await this.wxLogin(jsCode);
    let wxLoginData = {};
    if (
      wxLoginResult.status === 200 &&
      wxLoginResult.data.session_key &&
      wxLoginResult.data.openid &&
      wxLoginResult.data.unionid
    ) {
      wxLoginData = {
        sessionKey: wxLoginResult.data.session_key,
        openId: wxLoginResult.data.openid,
        unionId: wxLoginResult.data.unionid
      };
      const newUser = await ctx.service.tenantsUser.insert({
        phone,
        sourceType: userType,
        status: 1,
        name: '用户' + phone,
        ...wxLoginData
      });
      return newUser.id;
    }
    return false;
  }
  // 微信登录
  async loginByWx() {
    const { ctx } = this;
    const code = ctx.query.code;
    const jsCode = ctx.query.jsCode;
    const userType = ctx.query.userType;
    const loginRule = {
      code: 'string',
      jsCode: 'string'
    };
    ctx.validate(loginRule, ctx.query);
    const tenantsWxToken = await this.getWxToken();
    const getPhoneResult = await this.getPhone(tenantsWxToken, code);
    if (
      getPhoneResult.status === 200 &&
      getPhoneResult.data.phone_info &&
      getPhoneResult.data.phone_info.phoneNumber

    ) {
      const id = await this.getUserId(getPhoneResult.data.phone_info.phoneNumber, jsCode, userType);
      if (id) {
        const userToken = ctx.app.jwt.sign({
          data: {
            id
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
          message: '获取用户ID失败!'
        };
      }
    } else {
      ctx.body = {
        status: -1,
        data: '',
        message: '获取用户手机号失败!'
      };
    }
  }
  // 获取微信token
  async getWxToken() {
    const { ctx, app } = this;
    let token = await app.redis.get('tenantsWxToken');
    if (!token) {
      const result = await ctx.curl('https://api.weixin.qq.com/cgi-bin/token', {
        method: 'GET',
        dataType: 'json',
        data: {
          appid: app.config.tenantsMP.appid,
          secret: app.config.tenantsMP.secret,
          grant_type: 'client_credential'
        }
      });
      await app.redis.set('tenantsWxToken', result.data.access_token, 'EX', 7200);
      token = result.data.access_token;
    }
    return token;
  }
  // 获取用户手机号
  async getPhone(access_token, code) {
    const { ctx } = this;
    const result = await ctx.curl(`https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${access_token}`, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        code
      }
    });
    return result;
  }
  // 微信登录
  async wxLogin(js_code) {
    const { ctx, app } = this;
    const result = await ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
      method: 'GET',
      dataType: 'json',
      data: {
        appid: app.config.tenantsMP.appid,
        secret: app.config.tenantsMP.secret,
        js_code,
        grant_type: 'authorization_code'
      }
    });
    return result;
  }
  async update() {
    const { ctx } = this;
    const data = ctx.request.body;
    const token = ctx.header.authorization;
    data.userId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const updateUser = await ctx.service.tenantsUser.update(data);
    ctx.body = {
      status: 1,
      data: updateUser
    };

  }
  async getHouseByTenantId() {
    const { ctx } = this;
    const data = {};
    const token = ctx.header.authorization;
    data.id = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const userHosue = await ctx.service.tenantsUser.getHouseByTenantId(data, ctx.query.type);
    if (userHosue) {
      const houseList = userHosue.map(item => {
        try {
          item.dataValues.tenantsUsers = item.dataValues.tenantsUsers[0];
          item.dataValues.checkInTime = item.dataValues.tenantsUsers.houseLinkTenant.createdAt;
          item.dataValues.houseStatus = item.dataValues.tenantsUsers.houseLinkTenant.status;
          item.dataValues.checkInDays = Math.ceil((Date.now() - new Date(item.dataValues.checkInTime).getTime()) / 86400000);
        } catch (error) {
          item.dataValues.checkInTime = '';
          item.dataValues.houseStatus = '';
          item.dataValues.checkInDays = '';
        }
        if (
          item.dataValues.comments &&
          Array.isArray(item.dataValues.comments) &&
          item.dataValues.comments.length > 0
        ) {
          item.dataValues.commentId = item.dataValues.comments[0].id;
        }
        delete item.dataValues.comments;
        return item;
      });
      ctx.body = {
        status: 1,
        data: houseList
      };
    } else {
      ctx.body = {
        status: -1,
        message: '查询失败'
      };
    }
  }
  async getMaintenanceListByTenantId() {
    const data = this.ctx.query || {};
    const token = this.ctx.header.authorization;
    data.id = this.ctx.app.jwt.verify(token.slice(7), this.ctx.app.config.jwt.secret).data.id;
    const maintenanceList = await this.ctx.service.tenantsUser.getMaintenanceListByTenantId(data);
    if (maintenanceList) {
      this.ctx.body = {
        status: 1,
        data: maintenanceList
      };
    } else {
      this.ctx.body = {
        status: -1,
        message: '查询报修出错'
      };
    }
  }
  async updateStatus() {
    const { ctx } = this;
    const data = ctx.request.body;
    const updateUser = await ctx.service.tenantsUser.update({
      userId: data.id,
      status: data.status
    });
    ctx.body = {
      status: 1,
      data: updateUser
    };

  }
  async selectByMaintenanceId() {
    const { ctx } = this;
    const userInfo = await ctx.service.tenantsUser.selectByMaintenanceId(ctx.query.id);
    if (userInfo) {
      delete userInfo.dataValues.houseMaintenances;
      ctx.body = {
        status: 1,
        data: userInfo
      };
    } else {
      ctx.body = {
        status: -1,
        data: '',
        message: '未查询到用户'
      };
    }

  }
}

module.exports = TenantsUserController;

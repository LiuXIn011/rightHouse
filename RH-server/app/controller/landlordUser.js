'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
  // 获取用户列表
  async list() {
    const { ctx } = this;
    const data = ctx.query;
    const landlordUserData = await ctx.service.landlordUser.list(data);
    ctx.body = {
      status: 1,
      count: landlordUserData.count,
      data: landlordUserData.rows
    };
  }
  // 获取用户详情
  async selectById() {
    const { ctx } = this;
    const token = ctx.header.authorization;
    const userId = ctx.query.id || ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const landlordUser = await ctx.service.landlordUser.selectById(userId);
    if (landlordUser) {
      ctx.body = {
        status: 1,
        data: landlordUser
      };
    } else {
      ctx.body = {
        status: -1,
        data: '',
        message: '未查询到用户'
      };
    }

  }
  // 获取用户详情
  async selectByHouseId() {
    const { ctx } = this;
    const landlordUser = await ctx.service.landlordUser.selectByHouseId(ctx.query.id);
    if (landlordUser) {
      delete landlordUser.dataValues.houses;
      ctx.body = {
        status: 1,
        data: landlordUser
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
    const landlordUser = await ctx.service.landlordUser.selectByPhone(phone);
    if (landlordUser) {
      return landlordUser.id;
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
      const newUser = await ctx.service.landlordUser.insert({
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
    const landlordWxToken = await this.getWxToken();
    const getPhoneResult = await this.getPhone(landlordWxToken, code);
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
          message: '获取用户失败!'
        };
      }
    } else {
      ctx.body = {
        status: -1,
        data: '',
        message: '获取用户失败!'
      };
    }
  }
  // 获取微信token
  async getWxToken() {
    const { ctx, app } = this;
    let token = await app.redis.get('landlordWxToken');
    if (!token) {
      const result = await ctx.curl('https://api.weixin.qq.com/cgi-bin/token', {
        method: 'GET',
        dataType: 'json',
        data: {
          appid: app.config.landlordMP.appid,
          secret: app.config.landlordMP.secret,
          grant_type: 'client_credential'
        }
      });
      await app.redis.set('landlordWxToken', result.data.access_token, 'EX', 7200);
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
        appid: app.config.landlordMP.appid,
        secret: app.config.landlordMP.secret,
        js_code,
        grant_type: 'authorization_code'
      }
    });
    return result;
  }
  // 发送模板消息
  async sendMessage() {
    const { ctx } = this;
    const access_token = await this.getWxToken();
    const result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`, {
      method: 'POST',
      dataType: 'json',
      contentType: 'json',
      data: {
        template_id: '4g2brsgOcsiXpw0url5F8_1_uq8eypuuEfcg99Yt6zM',
        page: '/pages/index/index',
        touser: 'oMKRd47VudKWOctCTH4Gp-S5jgcs',
        data: {
          car_number1: {
            value: '123'
          },
          thing2: {
            value: '456'
          }
        },
        miniprogram_state: 'formal',
        lang: 'zh_CN'
      }
    });
    ctx.body = result.data;
  }
  async update() {
    const { ctx } = this;
    const data = ctx.request.body;
    const token = ctx.header.authorization;
    data.id = data.id || ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const updateUser = await ctx.service.landlordUser.update(data);
    ctx.body = {
      status: 1,
      data: updateUser
    };

  }
  async getMaintenanceListByLandlordId() {
    const data = this.ctx.query || {};
    const token = this.ctx.header.authorization;
    data.id = this.ctx.app.jwt.verify(token.slice(7), this.ctx.app.config.jwt.secret).data.id;
    const maintenanceList = await this.ctx.service.landlordUser.getMaintenanceListByLandlordId(data);
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
    const updateUser = await ctx.service.landlordUser.update({
      id: data.id,
      status: data.status
    });
    ctx.body = {
      status: 1,
      data: updateUser
    };

  }
  async getRentalMarketAndCommentsByLandlordId() {
    const { ctx } = this;
    const rules = {
      landlordId: 'id'
    };
    ctx.validate(rules, ctx.query);
    const rentalMarketList = await this.ctx.service.landlordUser.getRentalMarketAndCommentsByLandlordId(this.ctx.query.landlordId);
    if (rentalMarketList) {
      this.ctx.body = {
        status: 1,
        data: rentalMarketList
      };
    } else {
      this.ctx.body = {
        status: -1,
        message: '查询出错'
      };
    }
  }
}

module.exports = UserController;

'use strict';

const { Controller } = require('egg');
const cityCode = require('../public/js/cityCode');
class HouseController extends Controller {
  // 获取省市区数据
  async getCityCode() {
    const { ctx } = this;
    if (cityCode) {
      ctx.body = {
        status: 1,
        data: cityCode
      };
    } else {
      ctx.body = {
        status: -1,
        data: [],
        message: '地址获取失败'
      };
    }
  }
  // 添加
  async insert() {
    // 获取省市区id
    function findCodeByProvinceName(data) {
      // 循环一级找省
      for (let i = 0; i < cityCode.length; i++) {
        const provinceItem = cityCode[i];
        if (provinceItem.name === data.provinceName) {
          data.provinceId = provinceItem.id;
          // 循环二级找市
          for (let j = 0; j < provinceItem.child.length; j++) {
            const cityItem = provinceItem.child[j];
            if (cityItem.name === data.cityName) {
              data.cityId = cityItem.id;
              // 循环三级找区
              for (let k = 0; k < cityItem.child.length; k++) {
                const areaItem = cityItem.child[k];
                if (areaItem.name === data.areaName) {
                  data.areaId = areaItem.id;
                  break;
                }
              }
              break;
            }
          }
          break;
        }
      }
    }

    const { ctx } = this;
    const insertRule = {
      // name: 'string',
      // provinceName: 'string',
      // cityName: 'string',
      // areaName: 'string',
      // provinceId: 'string',
      // cityId: 'string',
      // parentId: 'number',
      // area: 'number',
      // price: 'number',
      // fake_price: 'number',
      // areaId: 'string'
    };
    ctx.validate(insertRule, ctx.request.body);
    const data = ctx.request.body;
    const token = ctx.header.authorization;
    data.userId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    data.headImg = JSON.stringify(data.headImg);
    data.price = data.price || 0;
    data.fakePrice = data.fakePrice || 0;
    data.waterFee = data.waterFee || 0;
    data.electricityFee = data.electricityFee || 0;
    data.internetFee = data.internetFee || 0;
    data.fuelFee = data.fuelFee || 0;
    // 获取省市区id
    findCodeByProvinceName(data);
    const insertHouse = await ctx.service.house.insert(data);
    ctx.body = {
      status: 1,
      data: insertHouse.id
    };
  }
  // 查询
  async select() {
    const { ctx } = this;
    const data = ctx.query;
    const token = ctx.header.authorization;
    data.userId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const selectHouse = await ctx.service.house.select(data);
    ctx.body = {
      status: 1,
      data: selectHouse.map(item => {
        // 封面图处理
        if (item.headImg) {
          const imgList = JSON.parse(item.headImg);
          if (
            imgList &&
            imgList.length > 0
          ) {
            item.headImg = imgList;
            item.dataValues.firstHeadImg = imgList[0].url;
          }
        }
        return item;
      })
    };
  }
  // 查询
  async selectById() {
    const { ctx } = this;
    const data = ctx.query;
    const selectHouse = await ctx.service.house.selectById(data);
    ctx.body = {
      status: 1,
      data: selectHouse
    };
  }
  // 更新
  async update() {
    const { ctx } = this;
    const data = ctx.request.body;
    const token = ctx.header.authorization;
    data.userId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    data.headImg = JSON.stringify(data.headImg);
    const updateHouse = await ctx.service.house.update(data);
    ctx.body = {
      status: 1,
      data: updateHouse
    };
  }
  // 删除
  async delete() {
    const { ctx } = this;
    const data = ctx.query;
    const token = ctx.header.authorization;
    data.userId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const deleteHouse = await ctx.service.house.delete(data);
    ctx.body = {
      status: 1,
      data: deleteHouse
    };
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
  // 添加租客
  async addTenants() {
    const { ctx } = this;
    const id = ctx.query.id;
    const t = Date.now();
    const wxToken = await this.getWxToken();
    const token = ctx.header.authorization;
    const landlordId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const result = await ctx.curl(`https://api.weixin.qq.com/wxa/getwxacode?access_token=${wxToken}`, {
      method: 'POST',
      contentType: 'json',
      data: {
        path: `house_pages/house/join?id=${id}&t=${t}&landlordId=${landlordId}`,
        width: 300,
        line_color: {
          r: 41,
          g: 121,
          b: 255
        },
        is_hyaline: true
      }
    });
    if (
      result &&
      result.status === 200 &&
      result.data
    ) {
      ctx.body = {
        status: 1,
        data: result.data,
        message: ''
      };
    } else {
      ctx.body = {
        status: -1,
        data: '',
        message: '获取邀请码失败!'
      };
    }
  }
  // 入住
  async joinTenant() {
    const { ctx } = this;
    const token = ctx.header.authorization;
    const {
      landlordId,
      houseId
    } = ctx.query;
    const tenantId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const flag = await ctx.service.house.joinTenant({
      tenantId,
      landlordId,
      houseId
    });
    if (flag) {
      // 验证短信配置
      if (
        this.config.sms &&
        this.config.sms.client &&
        this.config.sms.client.accessKeyId &&
        this.config.sms.client.secretAccessKey &&
        this.config.houseJoinTenantMessage &&
        this.config.houseJoinTenantMessage.SignName &&
        this.config.houseJoinTenantMessage.TemplateCode
      ) {
        // 查询房东信息
        const houseLandlordInfo = await ctx.service.landlordUser.selectById(landlordId);
        if (
          houseLandlordInfo &&
          houseLandlordInfo.phone
        ) {
          // 发送租客入住短信
          ctx.sms.sendSMS({
            PhoneNumbers: houseLandlordInfo.phone,
            SignName: this.config.houseJoinTenantMessage.SignName,
            TemplateCode: this.config.houseJoinTenantMessage.TemplateCode
          });
        }

      }
      ctx.body = {
        status: 1,
        data: '',
        message: ''
      };
    } else {
      ctx.body = {
        status: -1,
        data: '',
        message: '入住失败!'
      };
    }
  }
  // 获取租客已经租的房间列表
  async getTenantsByHouseId() {
    const { ctx } = this;
    const houseId = ctx.query.houseId;
    const tenantStatus = ctx.query.tenantStatus;
    const tenantsList = await ctx.service.house.getTenantsByHouseId({ houseId, tenantStatus });

    if (tenantsList) {
      const list = tenantsList.map(item => {
        try {
          item.dataValues.houses = item.dataValues.houses[0];
          item.dataValues.checkInTime = item.dataValues.houses.houseLinkTenant.createdAt;
          item.dataValues.outTime = item.dataValues.houses.houseLinkTenant.updatedAt;
          item.dataValues.tenantStatus = item.dataValues.houses.houseLinkTenant.status;
        } catch (error) {
          item.dataValues.checkInTime = '';
          item.dataValues.outTime = '';
          item.dataValues.tenantStatus = '';
        }
        return item;
      });
      ctx.body = {
        status: 1,
        data: list,
        message: ''
      };
    } else {
      ctx.body = {
        status: -1,
        data: [],
        message: '查询失败'
      };
    }
  }
  // 报修
  async maintenance() {
    const { ctx } = this;
    const token = ctx.header.authorization;
    const data = ctx.request.body;
    data.images = JSON.stringify(data.images);
    data.tenantId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    const addFlag = await ctx.service.house.maintenance(data);
    if (addFlag) {
      // 验证短信配置
      if (
        this.config.sms &&
        this.config.sms.client &&
        this.config.sms.client.accessKeyId &&
        this.config.sms.client.secretAccessKey &&
        this.config.houseMaintenanceMessage &&
        this.config.houseMaintenanceMessage.SignName &&
        this.config.houseMaintenanceMessage.TemplateCode
      ) {
        // 查询房东信息
        const houseLandlordInfo = await ctx.service.landlordUser.selectByHouseId(data.houseId);
        if (
          houseLandlordInfo &&
          houseLandlordInfo.phone
        ) {
          // 发送报修短信通知
          ctx.sms.sendSMS({
            PhoneNumbers: houseLandlordInfo.phone,
            SignName: this.config.houseMaintenanceMessage.SignName,
            TemplateCode: this.config.houseMaintenanceMessage.TemplateCode
          });
        }
      }

      ctx.body = {
        status: 1,
        message: ''
      };
    } else {
      ctx.body = {
        status: -1,
        message: '报修失败'
      };
    }
  }
  async solveMaintenance() {
    const { ctx } = this;
    const data = ctx.query;
    const solveFlag = await ctx.service.house.solveMaintenance(data);
    if (solveFlag) {
      if (
        this.config.sms &&
        this.config.sms.client &&
        this.config.sms.client.accessKeyId &&
        this.config.sms.client.secretAccessKey &&
        this.config.houseSolveMaintenanceMessage &&
        this.config.houseSolveMaintenanceMessage.SignName &&
        this.config.houseSolveMaintenanceMessage.TemplateCode
      ) {
        // 查询报修人信息
        const tenantsUserInfo = await ctx.service.tenantsUser.selectByMaintenanceId(data.id);
        if (
          tenantsUserInfo &&
          tenantsUserInfo.phone
        ) {
          // 发送完成报修短信
          ctx.sms.sendSMS({
            PhoneNumbers: tenantsUserInfo.phone,
            SignName: this.config.houseSolveMaintenanceMessage.SignName,
            TemplateCode: this.config.houseSolveMaintenanceMessage.TemplateCode
          });
        }

      }
      ctx.body = {
        status: 1,
        message: ''
      };
    } else {
      ctx.body = {
        status: -1,
        message: '操作失败'
      };
    }
  }
  // 退租
  async houseOut() {
    const { ctx } = this;
    const data = ctx.request.body;
    // 如果没有传租客id，则是租客发起退租，去token取id
    if (!data.tenantId) {
      const token = ctx.header.authorization;
      data.tenantId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    }
    // 如果没有传房东id，则是房东发起清退，去token取id
    if (!data.landlordId) {
      const token = ctx.header.authorization;
      data.landlordId = ctx.app.jwt.verify(token.slice(7), ctx.app.config.jwt.secret).data.id;
    }
    const flag = await ctx.service.house.houseOut(data);
    if (flag) {
      if (
        this.config.sms &&
        this.config.sms.client &&
        this.config.sms.client.accessKeyId &&
        this.config.sms.client.secretAccessKey &&
        this.config.houseOutLandlordMessage &&
        this.config.houseOutLandlordMessage.SignName &&
        this.config.houseOutLandlordMessage.TemplateCode
      ) {
        // 查询房东信息
        const landlordUserInfo = await ctx.service.landlordUser.selectById(data.landlordId);
        if (
          landlordUserInfo &&
          landlordUserInfo.phone
        ) {
          // 发送退租短信
          ctx.sms.sendSMS({
            PhoneNumbers: landlordUserInfo.phone,
            SignName: this.config.houseOutLandlordMessage.SignName,
            TemplateCode: this.config.houseOutLandlordMessage.TemplateCode
          });
        }

      }

      if (
        this.config.sms &&
        this.config.sms.client &&
        this.config.sms.client.accessKeyId &&
        this.config.sms.client.secretAccessKey &&
        this.config.houseOutTenantMessage &&
        this.config.houseOutTenantMessage.SignName &&
        this.config.houseOutTenantMessage.TemplateCode
      ) {
        // 查询租客信息
        const tenantUserInfo = await ctx.service.tenantsUser.selectById(data.tenantId);
        if (
          tenantUserInfo &&
          tenantUserInfo.phone
        ) {
          // 发送退租短信
          ctx.sms.sendSMS({
            PhoneNumbers: tenantUserInfo.phone,
            SignName: this.config.houseOutTenantMessage.SignName,
            TemplateCode: this.config.houseOutTenantMessage.TemplateCode
          });
        }

      }
      ctx.body = {
        status: 1,
        message: ''
      };
    } else {
      ctx.body = {
        status: -1,
        message: '操作失败'
      };
    }
  }
  async list() {
    const { ctx } = this;
    const data = ctx.query;
    const houseData = await ctx.service.house.list(data);
    ctx.body = {
      status: 1,
      count: houseData.count,
      data: houseData.rows
    };
  }
}
module.exports = HouseController;

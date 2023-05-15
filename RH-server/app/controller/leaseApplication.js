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
    if (insertLease) {
      // 验证短信配置
      if (
        this.config.sms &&
        this.config.sms.client &&
        this.config.sms.client.accessKeyId &&
        this.config.sms.client.secretAccessKey &&
        this.config.tenantLeaseApplicationMessage &&
        this.config.tenantLeaseApplicationMessage.SignName &&
        this.config.tenantLeaseApplicationMessage.TemplateCode
      ) {
        // 查询房东信息
        const houseLandlordInfo = await ctx.service.landlordUser.selectById(ctx.request.body.landlordId);
        if (
          houseLandlordInfo &&
          houseLandlordInfo.phone
        ) {
          // 发送短信
          ctx.sms.sendSMS({
            PhoneNumbers: houseLandlordInfo.phone,
            SignName: this.config.tenantLeaseApplicationMessage.SignName,
            TemplateCode: this.config.tenantLeaseApplicationMessage.TemplateCode
          });
        }

      }
      ctx.body = {
        status: 1,
        data: insertLease.id
      };
    } else {
      ctx.body = {
        status: -1,
        message: '申请失败'
      };
    }

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
    if (ctx.request.body.status === 1) { // 验证通过，走入住流程
      joinFlag = await ctx.service.house.joinTenant(ctx.request.body);
      // 入住失败就不继续
      if (!joinFlag) {
        return false;
      }
      // 查询申请信息
      const leaseApplicationInfo = await ctx.service.leaseApplication.selectById(ctx.request.body.id);
      // 验证短信配置
      if (
        this.config.sms &&
        this.config.sms.client &&
        this.config.sms.client.accessKeyId &&
        this.config.sms.client.secretAccessKey &&
        this.config.passLeaseApplicationMessage &&
        this.config.passLeaseApplicationMessage.SignName &&
        this.config.passLeaseApplicationMessage.TemplateCode
      ) {
        if (
          leaseApplicationInfo &&
          leaseApplicationInfo.tenantsUser &&
          leaseApplicationInfo.tenantsUser.phone
        ) {
          // 发送通过短信通知
          ctx.sms.sendSMS({
            PhoneNumbers: leaseApplicationInfo.tenantsUser.phone,
            SignName: this.config.passLeaseApplicationMessage.SignName,
            TemplateCode: this.config.passLeaseApplicationMessage.TemplateCode
          });
        }
      }
      // 修改市场，将房屋下架
      if (leaseApplicationInfo.rentalMarketId) {
        await ctx.service.rentalMarket.updateStatus({
          id: leaseApplicationInfo.rentalMarketId,
          status: 2
        });
      }
    } else if (ctx.request.body.status === 2) { // 驳回申请
      // 验证短信配置
      if (
        this.config.sms &&
        this.config.sms.client &&
        this.config.sms.client.accessKeyId &&
        this.config.sms.client.secretAccessKey &&
        this.config.nopassLeaseApplicationMessage &&
        this.config.nopassLeaseApplicationMessage.SignName &&
        this.config.nopassLeaseApplicationMessage.TemplateCode
      ) {
        // 查询租客信息
        const leaseApplicationInfo = await ctx.service.leaseApplication.selectById(ctx.request.body.id);
        if (
          leaseApplicationInfo &&
          leaseApplicationInfo.tenantsUser &&
          leaseApplicationInfo.tenantsUser.phone
        ) {
          // 发送驳回短信通知
          ctx.sms.sendSMS({
            PhoneNumbers: leaseApplicationInfo.tenantsUser.phone,
            SignName: this.config.nopassLeaseApplicationMessage.SignName,
            TemplateCode: this.config.nopassLeaseApplicationMessage.TemplateCode
          });
        }

      }
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

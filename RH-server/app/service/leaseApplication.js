const { Service } = require('egg');
class LeaseService extends Service {
  async insert(data) {
    const leaseInsert = await this.ctx.model.LeaseApplication.create(data);
    return leaseInsert;
  }
  async list(data) {
    const option = {
      where: {
        status: 0
      },
      include: [
        {
          // 房屋信息
          model: this.ctx.model.House,
          required: true
        },
        {
          // 房东信息
          model: this.app.model.LandlordUser,
          required: true,
          attributes: [ 'name', 'headImg', 'id', 'phone' ]
        },
        {
          // 租客信息
          model: this.app.model.TenantsUser,
          required: true,
          attributes: [ 'name', 'headImg', 'id', 'phone' ]
        }
      ]
    };
    if (data.landlordId) {
      option.where.landlordId = data.landlordId;
    }
    if (data.status) {
      option.where.status = data.status;
    }
    const leaseList = await this.ctx.model.LeaseApplication.findAll(option);
    return leaseList;
  }
  async selectById(id) {
    const leaseObj = await this.ctx.model.LeaseApplication.findOne({
      where: {
        id
      },
      include: [
        {
          // 房屋信息
          model: this.ctx.model.House,
          required: true
        },
        {
          // 房东信息
          model: this.app.model.LandlordUser,
          required: true,
          attributes: [ 'name', 'headImg', 'id', 'phone' ]
        },
        {
          // 租客信息
          model: this.app.model.TenantsUser,
          required: true,
          attributes: [ 'name', 'headImg', 'id', 'phone' ]
        }
      ]
    });
    return leaseObj;
  }
  async updateStatus({
    id, status
  }) {
    const leaseObj = await this.selectById(id);
    leaseObj.status = status;
    await leaseObj.save();
    return leaseObj;
  }
}
module.exports = LeaseService;

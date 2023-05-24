const { Service } = require('egg');
class UserService extends Service {
  async list(params) {
    const Op = this.app.Sequelize.Op;
    const option = {
      attributes: [ 'id', 'name', 'remark', 'phone', 'sourceType', 'status', 'headImg', 'createdAt', 'updatedAt' ],
      where: {
        status: {
          [Op.ne]: 3
        },
        name: {
          [Op.like]: params.name ? `%${params.name}%` : '%'
        },
        phone: {
          [Op.like]: params.phone ? `%${params.phone}%` : '%'
        }
      },
      // 排序
      order: [
        [ 'createdAt', 'DESC' ]
      ]
    };
    // 是否分页
    if (
      params.size &&
      params.index &&
      params.size > 0 &&
      params.index > 0
    ) {
      option.limit = Number(params.size);
      option.offset = (Number(params.size) * (Number(params.index) - 1));
    }
    // 搜索参数
    if (
      params.sourceType
    ) {
      option.where.sourceType = params.sourceType;
    }
    if (
      params.status
    ) {
      option.where.status = params.status;
    }
    // 是否限制时间
    if (params.starTime && params.endTime) {
      option.where.createdAt = {
        [Op.gte]: params.starTime,
        [Op.lte]: params.endTime
      };
    }
    const data = await this.ctx.model.TenantsUser.findAndCountAll(option);
    return data;
  }
  async insert(data) {
    const tenantsUser = await this.ctx.model.TenantsUser.create(data);
    return tenantsUser;
  }
  async selectById(id) {
    // 用户信息
    const tenantsUser = await this.ctx.model.TenantsUser.findOne({
      attributes: [ 'id', 'name', 'createdAt', 'updatedAt', 'phone', 'remark', 'status', 'headImg' ],
      where: {
        id
      }
    });
    if (!tenantsUser) {
      return false;
    }
    return tenantsUser;
  }
  async selectByPhone(phone) {
    const tenantsUser = await this.ctx.model.TenantsUser.findOne({
      attributes: [ 'id', 'name', 'createdAt', 'updatedAt', 'phone', 'status', 'remark', 'headImg' ],
      where: {
        phone
      }
    });
    return tenantsUser;
  }
  async update(data) {
    const userInfo = await this.ctx.model.TenantsUser.findOne({
      attributes: [ 'id', 'name', 'createdAt', 'updatedAt', 'phone', 'status', 'remark', 'headImg' ],
      where: {
        id: data.userId
      }
    });
    await userInfo.update({
      ...data
    });
    return userInfo;
  }
  async getHouseByTenantId(data, type) {
    let where = {};
    if (type === 'all') {
      where = {
        '$tenantsUsers.id$': data.id
      };
    } else {
      where = {
        '$tenantsUsers.id$': data.id,
        '$tenantsUsers.houseLinkTenant.status$': 1
      };
    }
    const houseList = await this.ctx.model.House.findAll({
      attributes: [ 'name', 'id', 'headImg', 'price', 'provinceName', 'cityName', 'areaName', 'addresInfo' ],
      include: [{
        model: this.ctx.model.TenantsUser,
        attributes: [ 'name', 'id', 'phone' ],
        through: {
          attributes: [ 'createdAt', 'status' ]
        }
      }, {
        model: this.ctx.model.LandlordUser,
        attributes: [ 'name', 'id', 'phone' ]
      }, {
        model: this.ctx.model.Comments,
        required: false,
        where: {
          status: 1,
          tenantId: data.id
        }
      }],
      where,
      // 排序
      order: [[ this.ctx.model.TenantsUser, this.ctx.model.HouseLinkTenant, 'createdAt', 'DESC' ]]
    });
    return houseList;
  }
  async getMaintenanceListByTenantId(data) {
    return await this.ctx.model.HouseMaintenance.findAll({
      include: [
        {
          model: this.ctx.model.House,
          attributes: [ 'name', 'id', 'headImg', 'price', 'provinceName', 'cityName', 'areaName', 'addresInfo' ]
        }
      ],
      where: {
        tenantId: data.id
      },
      // 排序
      order: [
        [ 'createdAt', 'DESC' ]
      ]
    });
  }
  async selectByMaintenanceId(id) {
    const Op = this.app.Sequelize.Op;
    return await this.ctx.model.TenantsUser.findOne({
      attributes: [ 'id', 'name', 'remark', 'phone', 'sourceType', 'status', 'headImg', 'createdAt', 'updatedAt' ],
      include: [
        {
          model: this.ctx.model.HouseMaintenance,
          required: true,
          where: {
            id
          }
        }
      ],
      where: {
        status: {
          [Op.ne]: 3
        }
      }
    });
  }
}
module.exports = UserService;

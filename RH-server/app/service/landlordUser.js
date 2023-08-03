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
      include: [
        {
          // 房东的租赁房
          model: this.ctx.model.House,
          attributes: [ 'name', 'parentId', 'id', 'headImg', 'price', 'provinceName', 'cityName', 'areaName', 'addresInfo' ],
          required: false,
          where: {
            status: {
              [Op.ne]: 3
            }
          },
          include: [{
            // 房屋租客
            model: this.app.model.TenantsUser,
            attributes: [ 'name', 'headImg', 'phone', 'id' ],
            // 限制关联表状态
            through: {
              where: {
                status: 1
              }
            }
          }]
        }
      ],
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
    const data = await this.ctx.model.LandlordUser.findAndCountAll(option);
    return data;
  }
  async insert(data) {
    const landlordUser = await this.ctx.model.LandlordUser.create(data);
    return landlordUser;
  }
  async selectById(id) {
    const Op = this.app.Sequelize.Op;
    // 用户信息
    const landlordUser = await this.ctx.model.LandlordUser.findOne({
      attributes: [ 'id', 'name', 'createdAt', 'updatedAt', 'phone', 'status', 'headImg' ],
      where: {
        id
      }
    });
    if (!landlordUser) {
      return false;
    }
    // 用户所属一级房子数
    const houseList = await this.ctx.model.House.count({
      where: {
        userId: id,
        parentId: 0,
        status: {
          // 不查删除的
          [Op.ne]: 3
        }
      }
    });
    landlordUser.dataValues.houseLength = houseList;
    // 用户所属租客数
    const tenantsLength = await this.ctx.model.LandlordLinkTenant.count({
      where: {
        landlordId: id,
        status: 1
      }
    });
    landlordUser.dataValues.tenantsLength = tenantsLength;
    // 用户待解决报修数量
    const maintenanceLength = await this.ctx.model.HouseMaintenance.count({
      include: [
        {
          model: this.ctx.model.House,
          where: {
            userId: id
          }
        }
      ],
      where: {
        status: 0
      }
    });
    landlordUser.dataValues.maintenanceLength = maintenanceLength;
    // 用户申请租赁数量
    const leaseApplicationLength = await this.ctx.model.LeaseApplication.count({
      where: {
        status: 0,
        landlordId: id
      }
    });
    landlordUser.dataValues.leaseApplicationLength = leaseApplicationLength;
    return landlordUser;
  }
  async selectByPhone(phone) {
    const landlordUser = await this.ctx.model.LandlordUser.findOne({
      attributes: [ 'id', 'name', 'createdAt', 'updatedAt', 'phone', 'status', 'headImg' ],
      where: {
        phone
      }
    });
    return landlordUser;
  }
  async selectByHouseId(houseId) {
    const landlordUser = await this.ctx.model.LandlordUser.findOne({
      attributes: [ 'id', 'name', 'createdAt', 'updatedAt', 'phone', 'status', 'headImg' ],
      include: [
        {
          model: this.ctx.model.House,
          attributes: [ 'name', 'id', 'headImg', 'price', 'provinceName', 'cityName', 'areaName', 'addresInfo' ],
          where: {
            id: houseId
          },
          required: true
        }
      ]
    });
    return landlordUser;
  }
  async update(data) {
    const userInfo = await this.ctx.model.LandlordUser.findOne({
      attributes: [ 'id', 'name', 'createdAt', 'updatedAt', 'phone', 'status', 'remark', 'headImg' ],
      where: {
        id: data.id
      }
    });
    await userInfo.update({
      ...data
    });
    return userInfo;
  }
  async getMaintenanceListByLandlordId(data) {
    return await this.ctx.model.HouseMaintenance.findAll({
      include: [
        {
          model: this.ctx.model.House,
          attributes: [ 'name', 'id', 'headImg', 'price', 'provinceName', 'cityName', 'areaName', 'addresInfo' ],
          where: {
            userId: data.id
          }
        }
      ],
      where: {
        status: data.status || 0
      }
    });
  }
  async getRentalMarketAndCommentsByLandlordId(id) {
    return await this.ctx.model.LandlordUser.findOne({
      where: {
        id
      },
      attributes: { exclude: [ 'openId', 'sessionKey', 'sourceType', 'unionId' ] },
      include: [
        // 房市信息
        {
          model: this.ctx.model.RentalMarket,
          required: false,
          attributes: [ 'hotDegree', 'houseId', 'status', 'id',
          // 计算点赞数量
            [
              this.app.Sequelize.literal('(SELECT COUNT(*) FROM rental_market_link_tenant WHERE rental_market_id = rentalMarkets.id AND status = 1)'),
              'starCount'
            ]
          ],
          where: {
            status: 1
          },
          include: [
            {
              // 房屋信息
              model: this.ctx.model.House,
              required: true
            }
          ]
        },
        // 评论信息
        {
          model: this.ctx.model.Comments,
          required: false,
          attributes: [ 'landlordComment', 'landlordCommentImg', 'landlordScore' ],
          where: {
            status: 1
          },
          include: [
            {
              // 租客
              model: this.ctx.model.TenantsUser,
              required: true,
              attributes: [ 'name', 'id', 'headImg' ]
            }
          ]
        }
      ],
      // 排序
      order: [
        [ 'rentalMarkets', 'hotDegree', 'DESC' ]
      ],
    });
  }
}
module.exports = UserService;

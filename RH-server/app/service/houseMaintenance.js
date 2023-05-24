const { Service } = require('egg');
class HouseMaintenance extends Service {
  async list(params) {
    const Op = this.app.Sequelize.Op;
    const option = {
      where: {
        title: {
          [Op.like]: params.title ? `%${params.title}%` : '%'
        }
      },
      // raw: true,
      include: [
        {
          // 涉及房屋
          model: this.ctx.model.House,
          attributes: [ 'name', 'parentId', 'id', 'headImg', 'provinceName', 'cityName', 'areaName', 'addresInfo' ],
          where: {
          }
        },
        {
          // 涉及租客
          model: this.ctx.model.TenantsUser,
          attributes: [ 'name', 'id', 'headImg', 'phone' ],
          where: {
          }
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
      params.status
    ) {
      option.where.status = params.status;
    }
    if (
      params.houseName
    ) {
      option.include[0].where.name = {
        [Op.like]: `%${params.houseName}%`
      };
    }
    if (
      params.createdUser
    ) {
      option.include[1].where.name = {
        [Op.like]: `%${params.createdUser}%`
      };
    }
    // 是否限制时间
    if (params.starTime && params.endTime) {
      option.where.createdAt = {
        [Op.gte]: params.starTime,
        [Op.lte]: params.endTime
      };
    }
    // option.attributes = [ 'id', 'tenantId', 'houseId', 'title', 'status', 'images', 'video', 'createdAt', 'updatedAt' ];
    const data = await this.ctx.model.HouseMaintenance.findAndCountAll(option);
    return data;
  }
}
module.exports = HouseMaintenance;

const { Service } = require('egg');
class CommentsService extends Service {
  async insert(data) {
    const commentsInsert = await this.ctx.model.Comments.create(data);
    return commentsInsert;
  }
  async selectById(id) {
    const comment = await this.ctx.model.Comments.findOne({
      where: { id }
    });
    return comment;
  }
  async list(params) {
    const Op = this.app.Sequelize.Op;
    const option = {
      where: {
        status: {
          [Op.ne]: 3
        },
        [Op.or]: [
          {
            houseComment: {
              [Op.like]: params.comment ? `%${params.comment}%` : '%'
            }
          },
          {
            landlordComment: {
              [Op.like]: params.comment ? `%${params.comment}%` : '%'
            }
          }
        ]
      },
      include: [
        {
          // 房子
          model: this.ctx.model.House,
          attributes: [ 'name', 'id' ],
          where: [
            {
              name: {
                [Op.like]: params.house ? `%${params.house}%` : '%'
              }
            }
          ]
        },
        {
          // 房东
          model: this.ctx.model.LandlordUser,
          attributes: [ 'name', 'id' ],
          where: [
            {
              name: {
                [Op.like]: params.landlord ? `%${params.landlord}%` : '%'
              }
            }
          ]
        },
        {
          // 租客
          model: this.ctx.model.TenantsUser,
          attributes: [ 'name', 'id' ],
          where: [
            {
              name: {
                [Op.like]: params.tenant ? `%${params.tenant}%` : '%'
              }
            }
          ]
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
    // 是否限制时间
    if (params.starTime && params.endTime) {
      option.where.createdAt = {
        [Op.gte]: params.starTime,
        [Op.lte]: params.endTime
      };
    }
    // 搜索参数

    // option.attributes = [ 'id', 'name', 'userId', 'parentId', 'provinceId', 'cityId', 'areaId', 'provinceName', 'cityName', 'areaName', 'addresInfo'];
    const data = await this.ctx.model.Comments.findAndCountAll(option);
    return data;
  }
}
module.exports = CommentsService;

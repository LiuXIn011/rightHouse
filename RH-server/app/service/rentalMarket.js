const { Service } = require('egg');
class rentalMarket extends Service {
  async insert(data) {
    const rentalMarket = await this.ctx.model.RentalMarket.create(data);
    return rentalMarket;
  }
  async selectById(id) {
    const rentalMarket = await this.ctx.model.RentalMarket.findOne({
      where: {
        id
      }
    });
    return rentalMarket;
  }
  async selectByHouseId(houseId) {
    const rentalMarket = await this.ctx.model.RentalMarket.findOne({
      where: {
        houseId
      }
    });
    return rentalMarket;
  }
  async updateStatus({ id, status }) {
    const rentalMarketObj = await this.selectById(id);
    rentalMarketObj.status = status;
    await rentalMarketObj.save();
    return rentalMarketObj;
  }
  async list(params) {
    // const Op = this.app.Sequelize.Op;
    const option = {
      where: {
        status: 1
        // name: {
        //   [Op.like]: params.name ? `%${params.name}%` : '%'
        // },
        // phone: {
        //   [Op.like]: params.phone ? `%${params.phone}%` : '%'
        // }
      },
      include: [
        {
          // 房屋信息
          model: this.ctx.model.House,
          attributes: [ 'name', 'parentId', 'id', 'headImg', 'price', 'provinceName', 'cityName', 'areaName', 'addresInfo' ]
        },
        {
          // 房东信息
          model: this.app.model.LandlordUser,
          attributes: [ 'name', 'headImg', 'phone', 'id' ]
        }
      ],
      // 排序
      order: [
        [ 'hotDegree', 'DESC' ]
      ]
    };
    // 是否限制状态
    if (params.status === 0) {
      // 全部
      option.where.status = '';
    } else if (params.status) {
      // 指定状态
      option.where.status = params.status;
    }
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
    const data = await this.ctx.model.RentalMarket.findAndCountAll(option);
    return data;
  }
}
module.exports = rentalMarket;

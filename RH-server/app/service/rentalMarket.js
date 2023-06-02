const { Service } = require('egg');
const { addition, subtraction } = require('soeasymath');
class rentalMarket extends Service {
  async insert(data) {
    const rentalMarket = await this.ctx.model.RentalMarket.create(data);
    return rentalMarket;
  }
  async selectById(id, tenantId) {
    const option = {
      include: [
        {
          // 房屋信息
          model: this.ctx.model.House,
          required: true,
          attributes: [
            'name', 'parentId',
            'id', 'headImg',
            'price', 'provinceName',
            'cityName', 'areaName',
            'addresInfo', 'depositNumber',
            'priceNumber', 'waterFee',
            'electricityFee', 'internetFee',
            'fuelFee', 'area',
            'floor', 'toward',
            'toilet', 'kitchen',
            'balcony'
          ]
        },
        {
          // 房东信息
          model: this.app.model.LandlordUser,
          required: true,
          attributes: [ 'id', 'name', 'headImg', 'phone' ]
        },
        {
          // 申请租赁信息
          model: this.app.model.LeaseApplication,
          where: {
            status: 0
          },
          required: false
        },
        // 评论
        {
          model: this.ctx.model.Comments,
          required: false,
          as: 'houseComments',
          attributes: [ 'houseComment', 'houseCommentImg', 'houseScore' ],
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
      where: {
        id
      }
    };
    if (tenantId) {
      option.include[2].where.tenantId = tenantId;
    }
    const rentalMarket = await this.ctx.model.RentalMarket.findOne(option);
    return rentalMarket;
  }
  async selectByLandlordId({
    landlordId
  }) {
    const rentalMarket = await this.ctx.model.RentalMarket.findAll({
      where: {
        userId: landlordId,
        status: 1
      },
      include: [
        {
          // 房屋信息
          model: this.ctx.model.House,
          required: true,
          attributes: [
            'name', 'parentId',
            'id', 'headImg',
            'price', 'provinceName',
            'cityName', 'areaName',
            'addresInfo', 'depositNumber',
            'priceNumber', 'waterFee',
            'electricityFee', 'internetFee',
            'fuelFee', 'area',
            'floor', 'toward',
            'toilet', 'kitchen',
            'balcony'
          ]
        }
      ]
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
    const Op = this.app.Sequelize.Op;
    const option = {
      attributes: {
        include: [
          // 计算点赞数量
          [
            this.app.Sequelize.literal('(SELECT COUNT(*) FROM rental_market_link_tenant WHERE rental_market_id = rentalMarket.id AND status = 1)'),
            'starCount'
          ]
        ]
      },
      where: {
        status: 1
      },
      include: [
        {
          // 房屋信息
          model: this.ctx.model.House,
          required: true
          // attributes: [ 'name', 'parentId', 'id', 'headImg', 'price', 'provinceName', 'cityName', 'areaName', 'addresInfo' ]
        },
        {
          // 房东信息
          model: this.app.model.LandlordUser,
          required: true,
          attributes: [ 'name', 'headImg', 'id', 'phone' ]
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
    // 是否有模糊搜索
    if (params.keyword) {
      option.where = {
        ...option.where,
        [Op.or]: [
          {
            '$house.name$': {
              [Op.like]: `%${params.keyword}%`
            }
          },
          {
            '$landlordUser.name$': {
              [Op.like]: `%${params.keyword}%`
            }
          }
        ]
      };
    }
    // 是否限制经纬度（查询方圆2公里内的房源）
    // 1经度=85.276Km   1纬度=111Km
    if (params.longitude) {
      option.where['$house.longitude$'] = {
        [Op.between]: [ subtraction(params.longitude, 0.011), addition(params.longitude, 0.011) ]
      };
    }
    if (params.latitude) {
      option.where['$house.latitude$'] = {
        [Op.between]: [ subtraction(params.latitude, 0.009), addition(params.latitude, 0.009) ]
      };
    }
    // 房屋名称搜索
    if (params.houseName) {
      option.where = {
        ...option.where,
        '$house.name$': {
          [Op.like]: `%${params.houseName}%`
        }
      };
    }
    // 房东名称搜索
    if (params.landlordName) {
      option.where = {
        ...option.where,
        '$landlordUser.name$': {
          [Op.like]: `%${params.landlordName}%`
        }
      };
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
    // 是否限制时间
    if (params.starTime && params.endTime) {
      option.where.createdAt = {
        [Op.gte]: params.starTime,
        [Op.lte]: params.endTime
      };
    }
    const data = await this.ctx.model.RentalMarket.findAndCountAll(option);
    return data;
  }
  async checkHouseStar({
    rentalMarketId,
    tenantId,
    status
  }) {
    const option = {
      where: {}
    };
    if (rentalMarketId) {
      option.where.rentalMarketId = rentalMarketId;
    }
    if (tenantId) {
      option.where.tenantId = tenantId;
    }
    if (status) {
      option.where.status = status;
    }
    const data = await this.ctx.model.RentalMarketLinkTenant.findOne(option);
    return data;
  }
  async updateStarStatus({
    id, status, rentalMarketId
  }) {
    const option = {
      where: {
      }
    };
    if (id) {
      option.where.id = id;
    }
    if (rentalMarketId) {
      option.where.rentalMarketId = rentalMarketId;
    }
    const data = await this.ctx.model.RentalMarketLinkTenant.findOne(option);
    data.status = status;
    data.save();
    return data;
  }
  async updateStarHotDegree({
    id, hotDegree
  }) {
    const data = await this.ctx.model.RentalMarket.findOne({
      where: {
        id
      }
    });
    data.hotDegree += hotDegree;
    data.save();
    return data;
  }
  async insertStarHouse({
    rentalMarketId,
    tenantId
  }) {
    const data = await this.ctx.model.RentalMarketLinkTenant.create({
      rentalMarketId,
      tenantId
    });
    return data;
  }
  async starHouseListAndCount({
    tenantId,
    rentalMarketId,
    status
  }) {
    const option = {
      attributes: [ 'hotDegree', 'houseId', 'status', 'id',
        // 计算点赞数量
        [
          this.app.Sequelize.literal('(SELECT COUNT(*) FROM rental_market_link_tenant WHERE rental_market_id = rentalMarket.id AND status = 1)'),
          'starCount'
        ]
      ],
      include: [
        {
          // 房屋信息
          model: this.ctx.model.House,
          attributes: [
            'name', 'parentId',
            'id', 'headImg',
            'price', 'provinceName',
            'cityName', 'areaName',
            'addresInfo', 'depositNumber',
            'priceNumber', 'waterFee',
            'electricityFee', 'internetFee',
            'fuelFee', 'area',
            'floor', 'toward',
            'toilet', 'kitchen',
            'balcony'
          ]
        },
        {
          // 房东信息
          model: this.app.model.LandlordUser,
          attributes: [ 'id', 'name', 'headImg', 'phone' ]
        },
        {
          // 关联表状态限制
          model: this.app.model.TenantsUser,
          required: true,
          attributes: [],
          through: {
            attributes: [],
            where: {
              status: 1
            }
          }
        }
      ]
    };
    if (tenantId) {
      option.include[2].through.where.tenantId = tenantId;
    }
    if (rentalMarketId) {
      option.include[2].through.where.rentalMarketId = rentalMarketId;
    }
    if (status) {
      option.include[2].through.where.status = status;
    }
    const data = await this.ctx.model.RentalMarket.findAndCountAll(option);
    return data;
  }
}
module.exports = rentalMarket;

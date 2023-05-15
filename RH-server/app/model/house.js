/* indent size: 2 */
const timeFormat = require('silly-datetime');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('house', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: '房子id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name',
      comment: '房子名称'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      comment: '房东id'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'parent_id',
      comment: '上级房间id'
    },
    provinceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'province_id',
      comment: '省id'
    },
    provinceName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'province_name',
      comment: '省名称'
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'city_id',
      comment: '市id'
    },
    cityName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'city_name',
      comment: '市名称'
    },
    areaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'area_id',
      comment: '区id'
    },
    areaName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'area_name',
      comment: '区名称'
    },
    addresInfo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'addres_info',
      comment: '详细地址'
    },
    longitude: {
      type: DataTypes.DOUBLE(20, 8),
      allowNull: true,
      field: 'longitude',
      comment: '经度'
    },
    latitude: {
      type: DataTypes.DOUBLE(20, 8),
      allowNull: true,
      field: 'latitude',
      comment: '纬度'
    },
    area: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'area',
      comment: '面积'
    },
    price: {
      type: DataTypes.DOUBLE(20, 8),
      allowNull: true,
      field: 'price',
      comment: '租金'
    },
    fakePrice: {
      type: DataTypes.DOUBLE(20, 8),
      allowNull: true,
      field: 'fake_price',
      comment: '对外租金'
    },
    depositNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'deposit_number',
      comment: '押金月数'
    },
    priceNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'price_number',
      comment: '每次付月数'
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'floor',
      comment: '楼层'
    },
    toward: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'toward',
      comment: '朝向  1东  2西  3南  4北'
    },
    toilet: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'toilet',
      comment: '卫生间 0没有 1独立 2公用'
    },
    kitchen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'kitchen',
      comment: '厨房 0没有 1独立 2公用'
    },
    balcony: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'balcony',
      comment: '阳台  1有  0没有'
    },
    waterFee: {
      type: DataTypes.DOUBLE(20, 8),
      allowNull: true,
      field: 'water_fee',
      comment: '水费'
    },
    electricityFee: {
      type: DataTypes.DOUBLE(20, 8),
      allowNull: true,
      field: 'electricity_fee',
      comment: '电费'
    },
    internetFee: {
      type: DataTypes.DOUBLE(20, 8),
      allowNull: true,
      field: 'internet_fee',
      comment: '网费'
    },
    fuelFee: {
      type: DataTypes.DOUBLE(20, 8),
      allowNull: true,
      field: 'fuel_fee',
      comment: '燃气费'
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'note',
      comment: '备注'
    },
    headImg: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      field: 'head_img',
      comment: '图片'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1',
      field: 'status',
      comment: '状态  1待租 2已租 3删除'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
      comment: '创建时间',
      get() {
        return timeFormat.format(new Date(this.getDataValue('createdAt')), 'YYYY-MM-DD HH:mm:ss');
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
      comment: '最近更新时间',
      get() {
        return timeFormat.format(new Date(this.getDataValue('updatedAt')), 'YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    tableName: 'house'
  });

  Model.associate = function() {
    // 与房东的关联关系声明
    Model.belongsTo(app.model.LandlordUser, {
      foreignKey: 'userId'
    });
    // 与维修表的关系声明
    Model.hasMany(app.model.HouseMaintenance, {
      foreignKey: 'houseId'
    });
    // 与评论表的关系
    Model.hasMany(app.model.Comments, {
      foreignKey: 'houseId'
    });
    // 与房市记录的关系
    Model.hasOne(app.model.RentalMarket, {
      foreignKey: 'houseId'
    });
  };

  return Model;
};

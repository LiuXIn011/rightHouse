const timeFormat = require('silly-datetime');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('rentalMarket', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: '市场主键id'
    },
    houseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'house_id',
      comment: '关联房子id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      comment: '房东id'
    },
    hotDegree: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'hot_degree',
      defaultValue: 10,
      comment: '热度'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1',
      field: 'status',
      comment: '状态  1正常 2下架 3删除'
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
    tableName: 'rental_market'
  });
  Model.associate = function() {
    // 与房子的关联关系声明
    Model.hasOne(app.model.House, {
      foreignKey: 'id',
      otherKey: 'houseId'
    });
    app.model.House.hasOne(Model, {
      foreignKey: 'houseId',
      otherKey: 'id'
    });
    // 与房东的关联关系声明
    app.model.LandlordUser.hasMany(Model, {
      foreignKey: 'userId',
      otherKey: 'id'
    });
    Model.belongsTo(app.model.LandlordUser, {
      foreignKey: 'userId',
      otherKey: 'id'
    });
  };

  return Model;
};

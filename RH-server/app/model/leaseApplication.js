/* indent size: 2 */
const timeFormat = require('silly-datetime');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('leaseApplication', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: 'id'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0',
      field: 'status',
      comment: '状态 0未处理  1已通过 2已驳回'
    },
    houseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'house_id',
      comment: '房屋id'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'tenant_id',
      comment: '租客id'
    },
    landlordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'landlord_id',
      comment: '房东id'
    },
    rentalMarketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'rental_market_id',
      comment: '房市id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
      get() {
        return timeFormat.format(new Date(this.getDataValue('createdAt')), 'YYYY-MM-DD HH:mm:ss');
      },
      comment: '创建时间'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
      get() {
        return timeFormat.format(new Date(this.getDataValue('updatedAt')), 'YYYY-MM-DD HH:mm:ss');
      },
      comment: '最近更新时间'
    }
  }, {
    tableName: 'lease_application'
  });

  Model.associate = function() {
    // 与房东的关联关系声明
    Model.belongsTo(app.model.LandlordUser, {
      foreignKey: 'landlordId'
    });
    // 与租客的关联关系声明
    Model.belongsTo(app.model.TenantsUser, {
      foreignKey: 'tenantId'
    });
    // 与房屋的关联关系声明
    Model.belongsTo(app.model.House, {
      foreignKey: 'houseId'
    });
  };

  return Model;
};

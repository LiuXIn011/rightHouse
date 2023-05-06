/* indent size: 2 */
const timeFormat = require('silly-datetime');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('rentalMarketLinkTenant', {
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
      defaultValue: '1',
      field: 'status',
      comment: '状态 0取消关联  1正常关联'
    },
    rentalMarketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'rental_market_id',
      comment: '房市id'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'tenant_id',
      comment: '租客id'
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
    tableName: 'rental_market_link_tenant'
  });

  Model.associate = function() {
    app.model.RentalMarket.belongsToMany(app.model.TenantsUser, {
      through: Model,
      foreignKey: 'rentalMarketId',
      otherKey: 'tenantId'
    });
    app.model.TenantsUser.belongsToMany(app.model.RentalMarket, {
      through: Model,
      foreignKey: 'tenantId',
      otherKey: 'rentalMarketId'
    });
  };

  return Model;
};

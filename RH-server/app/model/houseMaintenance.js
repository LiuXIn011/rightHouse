/* indent size: 2 */
const timeFormat = require('silly-datetime');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('houseMaintenance', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: 'id'
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'tenant_id',
      comment: '租客id'
    },
    houseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'house_id',
      comment: '房间id'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'title',
      comment: '标题'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0',
      field: 'status',
      comment: '状态  0未处理  1已处理'
    },
    images: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      field: 'images',
      comment: '图片'
    },
    video: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'video',
      comment: '视频'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
      get() {
        return timeFormat.format(new Date(this.getDataValue('createdAt')), 'YYYY-MM-DD HH:mm:ss');
      },
      comment: '创建日期'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
      get() {
        return timeFormat.format(new Date(this.getDataValue('updatedAt')), 'YYYY-MM-DD HH:mm:ss');
      },
      comment: '更新日期'
    }
  }, {
    tableName: 'house_maintenance'
  });

  Model.associate = function() {
    // 与房屋的关系
    Model.belongsTo(app.model.House, {
      foreignKey: 'houseId'
    });
    // 与租客的关系
    Model.belongsTo(app.model.TenantsUser, {
      foreignKey: 'tenantId'
    });
  };

  return Model;
};

/* indent size: 2 */
const timeFormat = require('silly-datetime');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('landlordUser', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: 'id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'name',
      comment: '用户名称'
    },
    remark: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'remark',
      comment: '备注'
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'phone',
      comment: '手机号'
    },
    openId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'open_id',
      comment: '微信openId'
    },
    unionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'union_id',
      comment: '微信unionId'
    },
    sessionKey: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'session_key',
      comment: '微信sessionKey'
    },
    sourceType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'source_type',
      comment: '用户来源：1:微信'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status',
      comment: '状态：1：正常，2：停用，3：删除'
    },
    headImg: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'head_img',
      comment: '头像'
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
      comment: '最近更新日期'
    }
  }, {
    tableName: 'landlord_user'
  });

  Model.associate = function() {
    // 与房屋的关系
    Model.hasMany(app.model.House, {
      foreignKey: 'userId'
    });
    // 与评论表的关系
    Model.hasMany(app.model.Comments, {
      foreignKey: 'landlordId'
    });
    // 与房市的关系
    Model.hasMany(app.model.RentalMarket, {
      foreignKey: 'userId'
    });
  };

  return Model;
};

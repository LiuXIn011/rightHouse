const timeFormat = require('silly-datetime');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('comment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: 'id'
    },
    landlordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'landlord_id',
      comment: '房东id'
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
    houseScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'house_score',
      comment: '房间评分'
    },
    landlordScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'landlord_score',
      comment: '房东评分'
    },
    houseComment: {
      type: DataTypes.STRING(300),
      allowNull: false,
      field: 'house_comment',
      comment: '房间评价'
    },
    landlordComment: {
      type: DataTypes.STRING(300),
      allowNull: false,
      field: 'landlord_comment',
      comment: '房东评价'
    },
    houseCommentImg: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      field: 'house_comment_img',
      comment: '房间评价图片'
    },
    landlordCommentImg: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      field: 'landlord_comment_img',
      comment: '房东评价图片'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1',
      field: 'status',
      comment: '状态：1：正常，2：停用，3：删除'
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
    tableName: 'comment'
  });
  Model.associate = function() {
    // 与房屋的关系
    Model.belongsTo(app.model.House, {
      foreignKey: 'houseId'
    });
    // 与房东的关系
    Model.belongsTo(app.model.LandlordUser, {
      foreignKey: 'landlordId'
    });
    // 与租客的关系
    Model.belongsTo(app.model.TenantsUser, {
      foreignKey: 'tenantId'
    });
  };
  return Model;
};

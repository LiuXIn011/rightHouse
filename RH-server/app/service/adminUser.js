const { Service } = require('egg');
class AdminUserService extends Service {
  async login(phone) {
    const getUser = await this.ctx.model.AdminUser.findOne({
      where: {
        phone
      }
    });
    return getUser;
  }
  async getUserInfo(id) {
    const getUser = await this.ctx.model.AdminUser.findOne({
      where: {
        id
      },
      attributes: [ 'id', 'name', 'remark', 'phone', 'status', 'headImg', 'createdAt', 'updatedAt' ]
    });
    return getUser;
  }
}
module.exports = AdminUserService;

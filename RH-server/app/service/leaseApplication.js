const { Service } = require('egg');
class LeaseService extends Service {
  async insert(data) {
    const leaseInsert = await this.ctx.model.LeaseApplication.create(data);
    return leaseInsert;
  }
}
module.exports = LeaseService;

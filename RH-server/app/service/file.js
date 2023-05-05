const { Service } = require('egg');
const Minio = require('minio');
class FileService extends Service {
  async uploadOss(fileName, filePath) {
    const minioClient = new Minio.Client(this.config.minio);
    // 桶是否存在
    const hasBucket = await minioClient.bucketExists(this.config.minio.bucketName);
    if (!hasBucket) {
      // 不存在就创建一个桶
      await minioClient.makeBucket(this.config.minio.bucketName);
    }
    // 上传文件
    await minioClient.fPutObject(this.config.minio.bucketName, fileName, filePath);
    return this.config.minio.urldomain + this.config.minio.bucketName + '/' + fileName;
  }
  async updateFileOrgin(oldOrgin, newOrgin) {
    const rule = new RegExp(oldOrgin, 'g');
    const transaction = await this.ctx.model.transaction();
    try {
      // 更新房屋文件
      const houseList = await this.ctx.model.House.findAll({}, { transaction });
      if (houseList && houseList.length > 0) {
        for (let i = 0; i < houseList.length; i++) {
          const item = houseList[i];
          await item.update({
            headImg: item.headImg.replace(rule, newOrgin)
          }, { transaction });
        }
      }
      // 更新房屋报修文件
      const houseMaintenanceList = await this.ctx.model.HouseMaintenance.findAll({}, { transaction });
      if (houseMaintenanceList && houseMaintenanceList.length > 0) {
        for (let i = 0; i < houseMaintenanceList.length; i++) {
          const item = houseMaintenanceList[i];
          await item.update({
            video: item.video.replace(rule, newOrgin),
            images: item.images.replace(rule, newOrgin)
          }, { transaction });
        }
      }
      // 更新房东文件
      const landlordUserList = await this.ctx.model.LandlordUser.findAll({}, { transaction });
      if (landlordUserList && landlordUserList.length > 0) {
        for (let i = 0; i < landlordUserList.length; i++) {
          const item = landlordUserList[i];
          await item.update({
            headImg: item.headImg.replace(rule, newOrgin)
          }, { transaction });
        }
      }
      // 更新租客文件
      const tenantsUserList = await this.ctx.model.TenantsUser.findAll({}, { transaction });
      if (tenantsUserList && tenantsUserList.length > 0) {
        for (let i = 0; i < tenantsUserList.length; i++) {
          const item = tenantsUserList[i];
          await item.update({
            headImg: item.headImg.replace(rule, newOrgin)
          }, { transaction });
        }
      }

      // 更新评论文件
      const commentsList = await this.ctx.model.Comments.findAll({}, { transaction });
      if (commentsList && commentsList.length > 0) {
        for (let i = 0; i < commentsList.length; i++) {
          const item = commentsList[i];
          await item.update({
            houseCommentImg: item.houseCommentImg.replace(rule, newOrgin),
            landlordCommentImg: item.landlordCommentImg.replace(rule, newOrgin)
          }, { transaction });
        }
      }
      transaction.commit();
      return 'success';
    } catch (error) {
      console.log(error);
      transaction.rollback();
      return error;
    }
  }
}
module.exports = FileService;

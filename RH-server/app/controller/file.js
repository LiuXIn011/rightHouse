'use strict';

const { Controller } = require('egg');
const fs = require('fs');
const path = require('path');

class FileController extends Controller {
  async upload() {
    const { ctx } = this;
    try {
      // 1 获取我们上传文件。 是一个数组，只有一个文件情况下，默认为数组中的下标0。
      const file = ctx.request.files[0];
      // 时间
      const dateObj = new Date();
      const nowDate = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
      // 判断是否配置OSS
      if (this.config.minio) {
        // oss推送
        const name = nowDate + '/' + path.basename(file.filename);
        const url = await ctx.service.file.uploadOss(name, file.filepath);
        ctx.body = {
          status: 1,
          data: {
            url,
            filename: file.filename,
            encoding: file.encoding,
            mimeType: file.mimeType
          }
        };
      } else {
        // 走本地存贮
        // 判断文件夹是否存在
        // 读取文件
        const readFile = fs.readFileSync(file.filepath);
        const dirPath = this.config.uploadDir + '/' + nowDate;
        const hasDir = fs.existsSync(dirPath);
        if (!hasDir) {
          fs.mkdirSync(dirPath);
        }
        // 处理路径
        const uploadDir = path.join(dirPath, file.filename);
        // 写入文件
        fs.writeFileSync(uploadDir, readFile);
        ctx.body = {
          status: 1,
          data: {
            url: uploadDir.replace(/app/, ''), // 删除 /app/ 这个目录
            filename: file.filename,
            encoding: file.encoding,
            mimeType: file.mimeType
          }
        };
      }
    } catch (error) {
      console.log(error);
      ctx.body = {
        status: -1,
        message: '上传失败！',
        data: {}// 删除 /app/ 这个目录
      };
    } finally {
      // 清除临时文件
      ctx.cleanupRequestFiles();
    }
  }
  async updateFileOrgin() {
    const { ctx } = this;
    const data = ctx.query;
    if (data.o && data.n) {
      const resultData = await ctx.service.file.updateFileOrgin(data.o, data.n);
      ctx.body = {
        status: 1,
        message: '1',
        data: resultData
      };
    } else {
      ctx.body = {
        status: -1,
        message: '缺少参数'
      };
    }

  }
}

module.exports = FileController;

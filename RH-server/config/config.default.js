/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const config = exports = {};
  config.keys = appInfo.name + '_1667378056410_2465';

  // 中间件列表
  config.middleware = [ 'errorHandler' ];
  // 错误处理中间件
  config.errorHandler = {
    match: '/api'
  };

  const userConfig = {
    // 房东端小程序配置
    landlordMP: {
      appid: '',
      secret: ''
    },
    // 租客端小程序配置
    tenantsMP: {
      appid: '',
      secret: ''
    },
    // 上传文件目录
    uploadDir: 'app/public/upload',
    // oss配置minio
    minio: {
      endPoint: '', // 连接地址
      port: 9000, // 端口
      useSSL: false, // 不需要https
      accessKey: '',
      secretKey: '',
      urldomain: '', // 域名
      bucketName: 'filebucket' // 桶名称
    },
    // 房间报修阿里云短信通知
    houseMaintenanceMessage: {
      SignName: '',
      TemplateCode: ''
    },
    // 房间维修完毕阿里云短信通知
    houseSolveMaintenanceMessage: {
      SignName: '',
      TemplateCode: ''
    },
    // 房间入住阿里云短信通知
    houseJoinTenantMessage: {
      SignName: '',
      TemplateCode: ''
    },
    // 房间退租给租客的阿里云短信通知
    houseOutTenantMessage: {
      SignName: '',
      TemplateCode: ''
    },
    // 房间退租给房东的阿里云短信通知
    houseOutLandlordMessage: {
      SignName: '',
      TemplateCode: ''
    }
  };
  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    host: '',
    port: 3306,
    database: 'right_house_db',
    username: '',
    password: ''
  };
  // redis配置
  config.redis = {
    client: {
      port: 6379,
      host: '',
      password: '',
      db: 0
    }
  };
  // security
  config.security = {
    csrf: {
      enable: false
    }
  };
  // jwt
  config.jwt = {
    secret: '',
    sign: {
      expiresIn: 604800 // 过期时间
    }
  };
  // multipart
  config.multipart = {
    mode: 'file'
  };
  // 默认配置
  config.cluster = {
    listen: {
      port: 7001
    }
  };
  // 性能监控平台配置
  // config.alinode = {
  //   server: '',
  //   appid: '',
  //   secret: ''
  // };
  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  // 短信服务配置
  config.sms = {
    client: {
      accessKeyId: '',
      secretAccessKey: ''
    }
  };
  return {
    ...config,
    ...userConfig
  };
};

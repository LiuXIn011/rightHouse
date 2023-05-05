'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/file/upload', jwt, controller.file.upload);
  router.get('/api/file/updateFileOrgin', jwt, controller.file.updateFileOrgin);
};

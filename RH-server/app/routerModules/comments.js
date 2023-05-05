'use strict';

module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/comments/insert', jwt, controller.comments.insert);
  router.get('/api/comments/getList', jwt, controller.comments.getList);
  router.get('/api/comments/selectById', jwt, controller.comments.selectById);
};

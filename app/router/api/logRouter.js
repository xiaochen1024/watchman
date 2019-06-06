module.exports = app => {
  const { router, controller } = app;
  const { logController } = controller;
  const prefix = '/api/log';

  router.get(`${prefix}/report`, logController.report);
  router.post(`${prefix}`, logController.index);
  router.post(`${prefix}/parse`, logController.parseErrStack);
}

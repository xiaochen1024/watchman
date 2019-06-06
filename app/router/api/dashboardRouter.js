module.exports = app => {
  const { router, controller } = app;
  const { dashboardController } = controller.api;
  const prefix = '/api/dashboard';
  router.post(`${prefix}/history`, dashboardController.getHistory);
};

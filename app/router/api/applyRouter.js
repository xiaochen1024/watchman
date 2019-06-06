module.exports = (app) => {
  const { controller, router, middleware } = app;
  const checkPrivileges = middleware.checkPrivileges();

  const prefix = '/api/apply';

  router.get(`${prefix}/map`, controller.api.applyController.getApplyMap);
  router.resources('apply', prefix, controller.api.applyController);
  router.put(`${prefix}/:id/status`, checkPrivileges, controller.api.applyController.updateStatus);
};
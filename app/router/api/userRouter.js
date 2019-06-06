module.exports = app => {
  const { router, controller, middleware } = app;
  const { api: { userController }} = controller;
  const checkPrivileges = middleware.checkPrivileges();
  const prefix = '/api/user';

  router.post(`${prefix}/login`, userController.login);
  router.post(`${prefix}/register`, userController.register);
  router.post(`${prefix}`, checkPrivileges, userController.create);

  router.get(`${prefix}`, checkPrivileges, userController.index);
  router.get(`${prefix}/logout`, userController.logout);
  router.get(`${prefix}/session`, userController.getUserSession);
  router.get(`${prefix}/:userId`, checkPrivileges, userController.show);

  router.put(`${prefix}/:userId`, checkPrivileges, userController.update);
  router.put(`${prefix}/resetPassword`, userController.resetPassword);
  router.put(`${prefix}/adminResetPassword`, userController.adminResetPassword);
  router.put(`${prefix}/updateToAdmin/:userId`, checkPrivileges, userController.updateToAdmin);

  router.delete(`${prefix}/delete/:userId`, checkPrivileges, userController.delete);
};

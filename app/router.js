/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/demo.html', controller.demoController.demo);
  router.get('/bad.js', controller.badjsController.getjs);
  router.get('/', controller.pageController.login);

  require('./router/page')(app);

  require('./router/api')(app);
};

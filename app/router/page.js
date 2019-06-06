module.exports = app => {
  app.get('/login', app.controller.pageController.login);
  app.get('/home(/.+)?', app.controller.pageController.home);
};

const Controller = require('egg').Controller;

class PageController extends Controller {

  async login() {
    const { ctx } = this;
    await ctx.render('login.js');
  }
  async home() {
    const { ctx } = this;
    await ctx.render('home.js');
  }
}

module.exports = PageController;

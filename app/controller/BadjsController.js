const Controller = require('egg').Controller;

class BadjsController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.badjsService = ctx.service.badjsService;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async getjs() {
    const { ctx, badjsService } = this;
    const appkey = ctx.query.appkey;
    const result = await badjsService.getApply(appkey);
    ctx.set('Content-Type','application/javascript; charset=UTF-8');
    ctx.body = result;
  }
}

module.exports = BadjsController;

const Controller = require('egg').Controller;
const _ = require('lodash');

class DashboardController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.DashboardService = ctx.service.dashboardService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async getHistory() {
    const payload = this.ctx.request.body;
    const rows = await this.DashboardService.getHistory(payload);
    this.ctx.body = rows;
  }
}

module.exports = DashboardController;

const { Service } = require('egg');
const fs = require('fs');
const path = require('path');

class BadjsService extends Service {
  constructor(ctx) {
    super(...arguments);
    this.ApplyModel = ctx.model.ApplyModel;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async getApply(appkey) {
    const { ApplyModel, ServerResponse, ctx } = this;
    try {
      const apply = await ApplyModel.findOne({
        where: { appkey },
      });
      if (!apply) {
        return this.ServerResponse.createByErrorMsg('无效appkey');
      } else {
        const tryjs = fs.readFileSync(
          path.join(ctx.app.baseDir, 'app/inject/bj-report-tryjs.min.js'),
          { encoding: 'utf8' }
        );
        const reportjs = fs.readFileSync(
          path.join(ctx.app.baseDir, 'app/inject/bj-report.min.js'),
          { encoding: 'utf8' }
        );
        const initjs = `BJ_REPORT.init({
          id: ${apply.id},
          url: "${ctx.locals.apiConfig.fwGateway.baseURL}/log/report",
        });
        BJ_REPORT.tryJs().spyAll();
      `;
        return `${tryjs}${reportjs}${initjs}`
      }
    } catch (error) {
      return ServerResponse.createByErrorMsg('获取js失败');
    }
  }
}

module.exports = BadjsService;

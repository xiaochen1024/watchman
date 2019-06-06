const { Service } = require('egg');

class ReportService extends Service {
  constructor(ctx) {
    super(...arguments);

    this.LogModel = ctx.mongo.Log;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async pushLogs(logs) {
    const { app } = this;
    const { key } = app.config.logQueue;
    app.redis.rpush(key, JSON.stringify(logs));
  }

  async saveLogs(logs) {
    return await this.LogModel.insertMany(logs);
  }

  async fetchLogList({ pageNum = 1, pageSize = 20, filter } = payload) {
    const { ServerResponse, LogModel } = this;
    const { id, startDate, endDate } = filter;
    const finalFilter = {};
    if (id) {
      finalFilter.id = id;
    }
    if (startDate && endDate) {
      finalFilter.date = { $gte: startDate, $lte: endDate };
    }
    const errorMsg = '获取日志列表失败';
    try {
      const result = await LogModel.paginate(finalFilter, {
        sort: '-date',
        page: pageNum,
        limit: pageSize,
      });
      const logs = {
        docs: result.docs,
        total: result.total,
        pageNum: result.page,
        pageSize: result.limit,
      };
      return ServerResponse.createBySuccessData(logs);
    } catch (err) {
      this.app.logger.error(errorMsg, err);
      return ServerResponse.createByErrorMsg(errorMsg);
    }
  }
}

module.exports = ReportService;

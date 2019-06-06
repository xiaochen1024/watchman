const Service = require('egg').Service;

class DashboardService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.LogModel = ctx.mongo.Log;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async getHistory(payload) {
    const { startDate, endDate } = payload;
    try {
      const result = await this.LogModel.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $project: {
            yearMonthDay: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
            id: '$id',
          },
        },
        {
          $group: {
            _id: { id: '$id', yearMonthDay: '$yearMonthDay' },
            count: { $sum: 1 },
          },
        },
      ]);
      return this.ServerResponse.createBySuccessMsgAndData('查询成功', result);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('查询失败');
    }
  }
}

module.exports = DashboardService;

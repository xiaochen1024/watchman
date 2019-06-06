const { Controller } = require('egg');
const _ = require('lodash');
const SourceMapConsumer = require('source-map').SourceMapConsumer;

const REG_REFERER = /^https?:\/\/[^\/]+\//i;

const referer_match = function(project, req) {
  const referer = (((req || {}).headers || {}).referer || '').toString();

  const projectMatchDomain = project.domain || '';
  // no referer
  if (!referer) {
    // match match is * , no detect referer
    if (!projectMatchDomain) {
      return true;
    }
    return false;
  }
  const domain = (referer.match(REG_REFERER) || [''])[0] || '';
  return domain.indexOf(projectMatchDomain) !== -1;
};

const reponseReject = function(req, res, responseHeader) {};

function getClientIp(req) {
  try {
    var xff = (
      req.headers['X-Forwarded-For'] ||
      req.headers['x-forwarded-for'] ||
      ''
    )
      .split(',')[0]
      .trim();

    return xff || req.socket.remoteAddress;
  } catch (ex) {}

  return '0.0.0.0';
}


class LogController extends Controller {
  constructor(ctx) {
    super(...arguments);

    this.logService = ctx.service.logService;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  parseLogData(data) {
    const { ctx } = this;
    const ip = getClientIp(ctx.request);
    const userAgent = ctx.get('User-Agent');

    if (!data.count) {
      return _.extend({ ip, userAgent }, data);
    }

    const fixedParam = {
      id: data.id,
      uin: data.uin,
      count: data.count,
      ip,
      userAgent,
    };
    const newData = [];
    const keys = ['msg', 'target', 'rowNum', 'colNum', 'level', 'from'];

    for (let i = 0; i < data.count; i++) {
      const log = _.extend({}, fixedParam);
      for (let j = 0; j < keys.length; j++) {
        const k = keys[j];
        log[k] = data[`${k}[${i}]`] || '';
      }
      newData.push(log);
    }

    return newData;
  }

  report() {
    const { ctx, logService } = this;
    let params = ctx.query;

    if (ctx.method === 'POST') {
      params = ctx.reqest.body;
    }

    const id = Number(params.id) - 0;
    const project = this.app.projectCache.getProject(id);
    if (
      isNaN(id) ||
      id <= 0 ||
      id >= 9999 ||
      !project ||
      !referer_match(project, ctx.request)
    ) {
      const forbiddenData = '403 forbidden';
      ctx.response.set('Content-length', forbiddenData.length);
      ctx.status = 403;
      ctx.body = forbiddenData;
      ctx.logger.debug('report log request forbidden:' + params.id);

      return;
    }

    const logData = this.parseLogData(params);
    logService.pushLogs(logData);

    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Content-Type', 'image/jpeg');
    ctx.response.set('Connection', 'close');
    ctx.status = 204;
    ctx.body = '';
  }

  async index() {
    const { ctx, logService } = this;
    const payload = ctx.request.body;
    const currentUser = ctx.session.currentUser;
    const response = await logService.fetchLogList(payload);
    ctx.body = response;
  }

  async parseErrStack() {
    const { errStack } = this.ctx.query;
    const stream = await this.ctx.getFileStream();

    const parse = (errStack, stream) => {
      const reg = new RegExp(`\\.js:\\d+:\\d+`, 'g');
      let sourcemap = '';
      let result;
      const [line, column] = errStack
        .match(reg)[0]
        .replace('.js:', '')
        .split(':');
      return new Promise(function(resolve, reject) {
        stream.on('data', chunk => {
          sourcemap += chunk;
        });
        stream.on('end', async () => {
          try {
            const smc = await new SourceMapConsumer(sourcemap);
            result = smc.originalPositionFor({
              line: Number(line),
              column: Number(column),
            });
            resolve(result);
          } catch (error) {
            this.ctx.logger.error(error.message);
            reject(result);
          }
        });
      });
    };

    try {
      const res = await parse(errStack, stream);
      this.ctx.body = this.ServerResponse.createBySuccessMsgAndData(
        '解析成功',
        res
      );
    } catch (error) {
      this.ctx.body = this.ServerResponse.createByErrorMsg('解析失败');
    }
  }
}

module.exports = LogController;

const BaseAPI = require('./base_api');
const BusinessError = require('./error/business_error');
const HTTPError = require('./error/http_error');

class BaseFrontendWatchmanAPI extends BaseAPI {
  constructor(ctx) {
    let config = {};

    // 服务端实例化会传入ctx，否则为客户端实例化
    if (BaseAPI.IS_NODE) {
      const {
        baseInternalURL: baseURL,
        defaultOptions,
      } = ctx.app.config.externalAPI.fwGateway;
      config = { baseURL, defaultOptions };
    } else {
      config = window.__API_CONFIG__.fwGateway; // eslint-disable-line no-underscore-dangle
    }

    super(config);

    this.ctx = ctx;
  }

  createCookieHeader() {
    const cookieKeys = ['fw_sid', 'fw_sid.sig'];
    const { cookies } = this.ctx;

    let cookieStr = '';
    cookieKeys.forEach((k) => {
      const v = cookies.get(k, { signed: false });
      if (v) {
        cookieStr += `${k}=${v};`;
      }
    });

    return { Cookie: cookieStr };
  }

  async curl(path, options = {}) {
    const opt = options;
    if (BaseAPI.IS_NODE) {
      const cookieHeader = this.createCookieHeader();
      if (opt.headers) {
        const { Cookie: cookie = '' } = opt.headers;
        opt.headers.Cookie = cookie + cookieHeader.Cookie;
      } else {
        opt.headers = cookieHeader;
      }
    }

    try {
      const result = await super.curl(path, opt);
      const { data: resData } = result;
      if (resData.code > 0) {
        throw new BusinessError(resData);
      }
      return resData.data;
    } catch (err) {
      // 处理HTTP错误
      if (err.response && err.request) {
        throw new HTTPError(err);
      }

      throw err;
    }
  }
}

module.exports = BaseFrontendWatchmanAPI;

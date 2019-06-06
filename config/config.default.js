const path = require('path');

module.exports = appInfo => {
  const exports = {};

  // use for cookie sign key, should change to your own and keep security
  exports.keys = appInfo.name + '_Yid';

  exports.salt = appInfo.name + '_salt';

  exports.middleware = [ 'checkLogin', 'errorHandler', 'parseConfig', 'access' ];

  exports.validate = {
    convert: true,
  };

  exports.checkLogin = {
    match(ctx) {
      const pathname = ctx.path;
      const apiRegExp = RegExp('^/api/');
      const ignoreRegExps = [
        RegExp('^/api/user/(login|register)'),
        RegExp('^/api/log'),
      ];

      if (!apiRegExp.test(pathname)) {
        return false;
      }

      for (const ignoreRegExp of ignoreRegExps) {
        if (ignoreRegExp.test(pathname)) {
          return false;
        }
      }

      return true;
    }
  };

  exports.session = {
    key: 'fw_sid',
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
    encrypt: false,
  };

  exports.logQueue = {
    key: 'frontend_watchman_js_log',
  };

  exports.security = {
    csrf: {
      enable: false,
    },
    methodnoallow: {
      enable: false,
    },
  };

  exports.multipart = {
    fileSize: '300mb',
    whitelist: [ '.map', '.zip' ],
  };

  exports.cors = {
    credentials: true,
  };

  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(appInfo.baseDir, 'logs'),
  };

  exports.static = {
    maxAge: 60 * 60 * 24 * 365,
    prefix: '/static/',
    dir: [
      path.join(appInfo.baseDir, 'app/inject'),
      path.join(appInfo.baseDir, 'public')
    ],
  };

  exports.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    timezone: '+08:00', // 东八时区
    define: {
      freezeTableName: true,
    },
  };

  exports.externalAPI = {
    fwGateway: {
      baseInteralURL: '/',
      baseURL: '/',
      defaultOptions: {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    },
  };

  // exports.projectCache = {
    // client: {}
  // };

  return exports;
};

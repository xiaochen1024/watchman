const path = require('path');
const ip = require('ip');

exports.keys = 'keys';
exports.salt = 'salt';

exports.development = {
  ignoreDirs: [ 'app/web', 'public', 'config' ],
};

exports.sequelize = {
  database: 'frontend_watchman',
  host: 'localhost',
  port: '3306',
  username: 'root',
  password: '123456',
};

exports.mongoose = {
  client: {
    url: 'mongodb://localhost:27017/frontend_watchman',
    options: {},
  },
};

exports.redis = {
  client: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: 0,
  },
  agent: true,
};

exports.webpack = {
  webpackConfigList: [
    path.join(__dirname, '../webpack/client/webpackDevConfig'),
    path.join(__dirname, '../webpack/server/webpackDevConfig'),
  ],
};

const localIP = ip.address();
const domainWhiteList = [];
[ 9000, 9001, 9002, 5000 ].forEach(port => {
  domainWhiteList.push(`http://localhost:${port}`);
  domainWhiteList.push(`http://127.0.0.1:${port}`);
  domainWhiteList.push(`http://${localIP}:${port}`);
});

exports.security = { domainWhiteList };

exports.externalAPI = {
  fwGateway: {
    baseURL: 'http://127.0.0.1:5000/api',
    baseInternalURL: 'http://127.0.0.1:5000/api',
  },
};

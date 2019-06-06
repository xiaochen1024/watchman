const path = require('path');

exports.static = true;

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.reactssr = {
  enable: true,
  package: 'egg-view-react-ssr',
};

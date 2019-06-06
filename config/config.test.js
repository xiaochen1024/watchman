module.exports = () => {
  const exports = {};

  exports.keys = 'tivMfZoDl3';
  exports.salt = 'XwjybII3fC';

  exports.sequelize = {
    database: 'frontend_watchman',
    host: '121.43.177.8',
    port: '43306',
    username: 'root',
    password: '123456',
  };

  exports.mongoose = {
    client: {
      url: 'mongodb://121.43.177.8:27017/frontend_watchman',
      options: {},
    },
  };

  return exports;
};


const path = require('path');
const { createProjectCache } = require('./app/project_cache_manager');

function loadExternalApi(app) {
  const apiDir = path.join(app.baseDir, 'app/api');
  app.loader.loadToContext(apiDir, 'api', {
    call: true,
    fieldClasses: 'apiClasses',
    ignore: ['base*.js', 'error/*.js'],
  });
}

function consumeLogQueue(app) {
  const { key } = app.config.logQueue;
  app.redis.blpop(key, 5, async (err, result) => {
    if (err) {
      return;
    }

    if (!result) {
      setImmediate(consumeLogQueue, app);
      return;
    }

    try {
      const logs = JSON.parse(result[1]);
      await app.mongo.Log.insertMany(logs);
    } finally {
      setImmediate(consumeLogQueue, app);
    }
 });
}

module.exports = async (app) => {
  app.addSingleton('projectCache', createProjectCache);

  app.beforeStart(async () => {
    loadExternalApi(app);

    // await app.model.sync({ force: true }); // 开发环境使用
    await app.model.sync({});
  });

  app.ready(async () => {
    consumeLogQueue(app);
  });
};

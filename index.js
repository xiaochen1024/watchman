const workers = Number(process.argv[2] || require('os').cpus().length);
require('egg').startCluster({
  baseDir: __dirname,
  workers,
  port: process.env.PORT,
});

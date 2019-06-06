module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      const { ServerResponse, BusinessCode } = ctx.response;

      const { env } = app.config;
      const { code = -1, status = 500 } = err;

      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      let message = status === 500 && env === 'prod' ? '系统繁忙，请稍后重试' : err.message;

      if (status === 401) {
        return ctx.redirect(`/login?from=${encodeURIComponent(ctx.url)}`);
      }

      if (status === 422) {
        message = '请求参数有误';
      }

      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      // app.emit('error', err, this);
      ctx.logger.error(err);

      ctx.status = status;
      ctx.body = ServerResponse.createByErrorMsg(message);
    }
  };
};

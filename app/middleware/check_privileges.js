
const { ROLE_ADMIN } = require('../enum/Role');

module.exports = options => {

  return async function checkLogin(ctx, next) {
    const user = ctx.session.currentUser;
    const { ServerResponse, BusinessCode } = ctx.response;
    const { NO_PRIVILEGES } = BusinessCode;

    if (user.role !== ROLE_ADMIN) {
      ctx.body = ServerResponse.createByErrorCodeMsg(NO_PRIVILEGES, '无权限操作');
      return;
    }

    await next();
  };
};

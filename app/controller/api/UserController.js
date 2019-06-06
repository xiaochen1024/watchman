const Controller = require('egg').Controller;
const _ = require('lodash');
const Role = require('../../enum/Role');

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.UserModel = ctx.model.UserModel;
    this.UserService = ctx.service.userService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  // 登录
  async login() {
    const { username, password } = this.ctx.request.body;
    const response = await this.UserService.login(username, password);

    if (response.isSuccess()) {
      this.session.currentUser = response.getData();
    }

    this.ctx.body = response;
  }

  // 登出
  async logout() {
    this.ctx.session = null;
    this.ctx.body = this.ServerResponse.createBySuccess();
  }

  // 注册
  async register() {
    const user = this.ctx.request.body;
    const respponse = await this.UserService.register(user);
    this.ctx.body = respponse;
  }

  // 校验
  async checkValid() {
    const { value, type } = this.ctx.params;
    const response = await this.UserService.checkValid(type, value);
    this.ctx.body = response;
  }

  // 获取用户信息
  async getUserSession() {
    const { ctx, session, ServerResponse } = this;
    const user = session.currentUser;

    let response;
    if (user)  {
      response = ServerResponse.createBySuccessData(user);
    } else {
      ctx.status = 401;
      response = ServerResponse.createByErrorMsg('用户未登录');
    }

    ctx.body = response;
  }

  // 登录状态的重置密码
  async resetPassword() {
    let response;
    const { passwordOld, passwordNew } = this.ctx.request.body;
    const user = this.session.currentUser;
    if (!user) response = this.ServerResponse.createByErrorMsg('用户未登录');
    else response = await this.UserService.resetPassword(passwordOld, passwordNew, user);
    this.ctx.body = response;
  }

  async adminResetPassword() {
    const { userId, passwordNew } = this.ctx.request.body;
    const response = await this.UserService.adminResetPassword(userId, passwordNew);
    this.ctx.body = response;
  }

  // 修改用户信息
  async updateUserInfo() {
    const userInfo = this.ctx.request.body;
    const user = this.session.currentUser;
    const response = await this.UserService.updateUserInfo(userInfo, user);
    this.session.currentUser = response.getData();
    this.ctx.body = response;
  }

  async show() {
    const { ctx } = this;
    const userId = ctx.params.userId;
    const response = await this.UserService.getUserInfo(userId);
    ctx.body = response;
  }

  async index() {
    const payload = this.ctx.query;
    const res = await this.UserService.fetchUserList(payload);
    this.ctx.body = res;
  }

  async create() {
    const { ctx, UserService } = this;
    const rules = {
      userName: 'string',
      password: 'string?',
      email: 'string',
      phone: 'string?',
      enabled: 'int',
    };
    const user = {
      ..._.pick(ctx.request.body, ['userName', 'password', 'email', 'phone', 'enabled']),
      role: Role.ROLE_CUSTOMER,
    }

    ctx.validate(rules, user);

    if (!user.password) {
      user.password = user.userName + 'watchman';
    }

    const response = await UserService.createUser(user);

    ctx.body = response;
  }

  async update() {
    const { ctx, UserService } = this;
    const rules = {
      id: 'string',
      email: 'string',
      phone: 'string?',
      enabled: 'int',
    };
    const user = {
      id: ctx.params.userId,
      ..._.pick(ctx.request.body, ['email', 'phone', 'enabled']),
    };
    ctx.validate(rules, user);

    const response = await UserService.updateUser(user);
    ctx.body = response;
  }

  async delete() {
    const { userId } = this.ctx.params;
    const res = await this.UserService.deleteUser(userId);
    this.ctx.body = res;
  }

  async updateToAdmin() {
    const { userId } = this.ctx.params;
    const response = await this.UserService.updateToAdmin(userId);
    this.ctx.body = response;
  }

}


module.exports = UserController;

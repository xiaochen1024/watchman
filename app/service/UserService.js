const Service = require('egg').Service;
const md5 = require('md5');
const _ = require('lodash');
const { USERNAME, EMAIL } = require('../common/type');
const { ROLE_ADMAIN, ROLE_CUSTOMER } = require('../enum/Role');

const TOKEN = 'token_';

class UserService extends Service {
  constructor(ctx) {
    super(ctx);
    this.UserModel = ctx.model.UserModel;
    this.BusinessCode = ctx.response.BusinessCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.salt = ctx.app.config.salt;
  }

  /**
   *
   * @param field {String}
   * @param value {String}
   * @return {Promise.<boolean>}
   */
  async _checkExistColByField(field, value) {
    const data = await this.UserModel.findOne({
      attributes: [ field ],
      where: { [field]: value },
    });

    return !!data;
  }

  /**
   * @feature 校验 username email
   * @param value {String}
   * @param type {String}
   * @return ServerResponse.msg
   */
  async checkValid(type, value) {
    if (type.trim()) {
      if (USERNAME === type) {
        return await this._checkExistColByField(USERNAME, value)
          ? this.ServerResponse.createByErrorMsg('用户名已存在')
          : this.ServerResponse.createBySuccessMsg('用户名不存在');
      }
      if (EMAIL === type) {
        return await this._checkExistColByField(EMAIL, value)
          ? this.ServerResponse.createByErrorMsg('邮箱已存在')
          : this.ServerResponse.createBySuccessMsg('邮箱不存在');
      }
    }
    return this.ServerResponse.createByErrorMsg('参数错误');
  }

  async login(username, password) {
    // 用户名存在报错
    const validResponse = await this.checkValid(USERNAME, username);
    if (validResponse.isSuccess()) return validResponse;

    // 检查密码是否正确
    const user = await this.UserModel.findOne({
      attributes: [ 'userName', 'email', 'phone', 'role', 'enabled' ],
      where: {
        username,
        password: md5(password + this.salt),
      },
    });

    if (!user) {
      return this.ServerResponse.createByErrorMsg('密码错误');
    }

    if (!user.get('enabled')) {
      return this.ServerResponse.createByErrorMsg('账号被禁用');
    }

    const userInfo = user.toJSON();

    return this.ServerResponse.createBySuccessMsgAndData('登录成功', userInfo);
  }

  /**
   * @feature 注册, 只能注册为ROLE_CUSTOMER, ROLE_ADMAIN 需要管理员授权
   * @param user {Object} { username, password, ... }
   * @return {Promise.<void>}
   */
  async register(user) {
    // 用户名存在报错
    const validUsernameResponse = await this.checkValid(USERNAME, user.username);
    if (!validUsernameResponse.isSuccess()) return validUsernameResponse;

    // 邮箱存在报错
    const validEmailResponse = await this.checkValid(EMAIL, user.email);
    if (!validEmailResponse.isSuccess()) return validEmailResponse;

    try {
      user.role = ROLE_CUSTOMER;
      user.password = md5(user.password + this.salt);
      user = await this.UserModel.create(user);

      if (!user) {
        return this.ServerResponse.createByErrorMsg('注册用户失败');
      }

      user = user.toJSON();
      _.unset(user, 'password');

      return this.ServerResponse.createBySuccessMsgAndData('注册用户成功', user);
    } catch (err) {
      return this.ServerResponse.createByErrorMsg('注册用户失败');
    }
  }

  async createUser(user) {
    const errorMsg = '新建用户失败';

    const validUsernameResponse = await this.checkValid(USERNAME, user.userName);
    if (!validUsernameResponse.isSuccess()) {
      return validUsernameResponse;
    }

    user.password = md5(user.password + this.salt);

    try {
      user = await this.UserModel.create(user);
      if (user) {
        user = user.toJSON();
        _.unset(user, 'password');
        return this.ServerResponse.createBySuccessMsgAndData('创建用户成功', user);
      }

      return this.ServerResponse.createByErrorMsg(errorMsg);
    } catch (err) {
      _.unset(user, 'password');
      this.app.logger.error(errorMsg, user, err);
      return this.ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  async updateUser(user) {
    const errorMsg = '保存用户失败';
    try {
      const [count, rows] = await this.UserModel.update(
        user,
        { where: { id: user.id } }
      );
      if (count === 0) {
        return this.ServerResponse.createByErrorMsg('用户不存在');
      } else {
        return this.ServerResponse.createBySuccessMsgAndData(errorMsg)
      }
    } catch (err) {
      this.app.logger.error(errorMsg, user, err);
      return this.ServerResponse.createByErrorMsg(errorMsg)
    }
  }

  /**
   * @feature 在线修改密码
   * @param passwordOld {String}
   * @param passwordNew {String}
   * @param currentUser {Object} [id]: 防止横向越权
   * @return ServerResponse
   */
  async resetPassword(passwordOld, passwordNew, currentUser) {
    const result = await this.UserModel.findOne({
      attributes: [ 'username' ],
      where: { id: currentUser.id, password: md5(passwordOld + this.salt) },
    });
    if (!result) return this.ServerResponse.createByErrorMsg('旧密码错误');
    const [ rowCount ] = await this.UserModel.update({
      password: md5(passwordNew + this.salt),
    }, { where: { username: currentUser.username }, individualHooks: true });
    if (rowCount > 0) return this.ServerResponse.createBySuccessMsg('修改密码成功');
    return this.ServerResponse.createByErrorMsg('更新密码失败');
  }

  async adminResetPassword(userId, passwordNew) {
    const [ rowCount ] = await this.UserModel.update({
      password: md5(passwordNew + this.salt),
    }, { where: { id: userId }, individualHooks: true });
    if (rowCount > 0) return this.ServerResponse.createBySuccessMsg('修改密码成功');
    return this.ServerResponse.createByErrorMsg('更新密码失败');
  }

  /**
   * @feature 更新用户信息
   * @param userInfo
   * @param currentUser
   * @return {Promise.<ServerResponse>}
   */
  async updateUserInfo(userInfo, currentUser) {
    // username 不能被更新
    // email 校验email 是否存在，并且email 存在不是当前currentUser
    const result = await this.UserModel.findOne({
      attributes: [ 'email' ],
      where: {
        email: userInfo.email,
        id: { $not: currentUser.id },
        // '$not': [ { id: currentUser.id } ]
      },
    });
    if (result) return this.ServerResponse.createByErrorMsg('email已经存在, 请更换');
    const [ updateCount, [ updateRow ]] = await this.UserModel.update(userInfo, {
      where: { id: currentUser.id },
      individualHooks: true,
    });
    const user = _.pickBy(updateRow.toJSON(), (value, key) => {
      return [ 'id', 'username', 'email', 'phone' ].find(item => key === item);
    });
    if (updateCount > 0) return this.ServerResponse.createBySuccessMsgAndData('更新个人信息成功', user);
    return this.ServerResponse.createByError('更新个人信息失败');
  }

  /**
   * 获取用户信息
   * @param {String} userId
   * @return {Promise.<void>}
   */
  async getUser(userId) {
    const user = await this.UserModel.findOne({
      attributes: [ 'username', 'email', 'phone' ],
      where: { id: userId },
    });

    if (!user) {
      return this.ServerResponse.createByErrorMsg('用户不存在');
    }

    return this.ServerResponse.createBySuccessData(user.toJSON());
  }

  /**
   * @Reconstruction 中间件
   * @featrue 后台管理校验管理员
   * @param user {Object}
   * @return {Promise.<ServerResponse>}
   */
  async checkAdminRole(user) {
    if (user && user.role === ROLE_ADMAIN) return this.ServerResponse.createBySuccess();
    return this.ServerResponse.createByError();
  }

  /**
   * @Reconstruction 中间件
   * @featrue 检查是否登录、是否为管理员
   * @return {Promise.<*>}
   */
  async checkAdminAndLogin(user) {
    const response = await this.checkAdminRole(user);
    if (!response.isSuccess()) {
      return this.ServerResponse.createByErrorMsg('无权限操作, 需要管理员权限');
    }
    return this.ServerResponse.createBySuccess();
  }

  async fetchUserList({ username, pageNum = 1, pageSize = 7 }) {
    const filter = {};

    if (username) {
      filter.username = { $like: `%${username}%` };
    }

    try {
      const { count, rows } = await this.UserModel.findAndCount({
        where: filter,
        order: [[ 'id', 'ASC' ]],
        limit: Number(pageSize || 0),
        offset: Number(pageNum - 1 || 0) * Number(pageSize || 0),
      });

      if (rows.length < 1) {
        this.ServerResponse.createBySuccessMsg('无数据');
      }

      rows.forEach(row => row && row.toJSON());

      return this.ServerResponse.createBySuccessData({
        pageNum,
        pageSize,
        list: rows,
        total: count,
      });
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('获取用户列表失败');
    }
  }

  async deleteUser(userId) {
    try {
      const deleteCount = await this.UserModel.destroy({ where: { id: userId } });
      if (deleteCount > 0) {
        return this.ServerResponse.createBySuccessMsgAndData('删除用户成功');
      }
      return this.ServerResponse.createByErrorMsg('用户不存在');
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('删除用户失败');
    }
  }

  async updateToAdmin(userId) {
    try {
      const [ updateCount, [ updateRow ]] = await this.UserModel.update({ role: 1 }, {
        where: { id: userId },
        individualHooks: true,
      });

      if (updateCount > 0) {
        return this.ServerResponse.createBySuccessMsgAndData('更新角色成功');
      }
      return this.ServerResponse.createByErrorMsg('用户不存在');
    } catch (err) {
      return this.ServerResponse.createByError('更新角色失败');
    }

  }

}

module.exports = UserService;

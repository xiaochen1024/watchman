import { action, observable, computed } from 'mobx';

import UserAPI from 'api/user';

class UserStore {
  constructor(ctx, initialState) {
    this.userAPI = new UserAPI(ctx);

    if (initialState) {
      const { currentUser } =  initialState;
      this.currentUser = currentUser;
    }
  }

  @observable _userList = [];
  @computed.struct get userList() {
    return this._userList;
  }
  @observable currentUser = null;
  @observable pagination = {
    pageSize: 7,
    total: 0,
    current: 1,
  };

  @action login = async params => {
    const result = await this.userAPI.login(params);
    return result;
  };

  logout() {
    return this.userAPI.logout();
  };

  @action fetchUserSession = async () => {
    const user = await this.userAPI.getUserSession();
    this.currentUser = user;
    return user;
  }

  @action fetchUserList = async params => {
    const result = await this.userAPI.fetchUserList(params);
    this._userList = result.list;
    return result;
  };

  @action register = async params => {
    const result = await this.userAPI.register(params);
    return result;
  };

  saveUser(user) {
    if (user.id) {
      return this.userAPI.updateUser(user);
    } else {
      return this.userAPI.createUser(user);
    }
  }

  @action delUser = async userId => {
    const result = await this.userAPI.deleteUser(userId);
    return result;
  };

  @action updatePassword = async params => {
    const result = await this.userAPI.updatePassword(params);
    return result;
  };

  @action adminUpdatePassword = async params => {
    const result = await this.userAPI.adminUpdatePassword(params);
    return result;
  };

  @action updateToAdmin = async userId => {
    const result = await this.userAPI.updateToAdmin(userId);
    return result;
  };

  async fetchUserInfo(userId) {
    const result = await this.userAPI.fetchUserInfo(userId);
    return result;
  };
}

export default UserStore;

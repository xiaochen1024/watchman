const BaseFrontendGatewayAPI = require('./base_fw_api');

class UserAPI extends BaseFrontendGatewayAPI {
  login (params) {
    return this.post('/user/login', params);
  }

  logout() {
    return this.get('/user/logout');
  }

  getUserSession() {
    return this.get('/user/session');
  }

  fetchUserList(params) {
    return this.get(`/user`, params);
  }

  register(params) {
    return this.post('/user/register', params);
  }

  createUser(user) {
    return this.post('/user', user);
  }

  deleteUser(userId) {
    return this.delete(`/user/delete/${userId}`);
  }

  updateUser(user) {
    return this.put(`/user/${user.id}`, user);
  }

  updatePassword(params) {
    return this.put('/user/resetPassword', params);
  }

  adminUpdatePassword(params) {
    return this.put('/user/adminResetPassword', params);
  }

  updateToAdmin(userId) {
    return this.put(`/user/updateToAdmin/${userId}`);
  }

  fetchUserInfo() {
    return this.get('/user/info');
  }
}

module.exports = UserAPI;

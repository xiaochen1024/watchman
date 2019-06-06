const { SUCCESS, ERROR } = require('../enum/BusinessCode');

module.exports = class ServerResponse {
  constructor(code, msg, data) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  isSuccess() {
    return this.code === SUCCESS;
  }

  getCode() {
    return this.code;
  }

  getData() {
    return this.data;
  }

  getMsg() {
    return this.msg;
  }

  static createBySuccess() {
    return new ServerResponse(SUCCESS);
  }

  static createBySuccessMsg(msg) {
    return new ServerResponse(SUCCESS, msg, null);
  }

  static createBySuccessData(data) {
    return new ServerResponse(SUCCESS, null, data);
  }

  static createBySuccessMsgAndData(msg, data) {
    return new ServerResponse(SUCCESS, msg, data);
  }

  static createByError() {
    return new ServerResponse(ERROR, 'error', null);
  }

  static createByErrorMsg(errorMsg) {
    return new ServerResponse(ERROR, errorMsg, null);
  }

  static createByErrorCodeMsg(errorCode, errorMsg) {
    return new ServerResponse(errorCode, errorMsg, null);
  }
};

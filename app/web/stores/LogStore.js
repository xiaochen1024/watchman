import { action, observable } from 'mobx';

import LogAPI from 'api/log';

class LogStore {
  @observable
  logList = {
    docs: [],
    total: 0,
    pageNum: 1,
    pageSize: 20,
  };

  constructor(ctx, state) {
    this.logAPI = new LogAPI(ctx);

    if (state) {
    }
  }

  @action
  fetchLogList = async (pageNum, pageSize, filter) => {
    const result = await this.logAPI.fetchLogList(pageNum, pageSize, filter);
    this.logList = result;
    return result;
  };

  parseErrStack = async params => {
    const result = await this.logAPI.parseErrStack(params);
    return result;
  };
}

export default LogStore;

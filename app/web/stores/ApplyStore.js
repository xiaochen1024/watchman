import { action, observable } from 'mobx';

import ApplyAPI from 'api/apply';

class ApplyStore {
  @observable
  applyList = {
    list: [],
    total: 0,
    pageNum: 1,
    pageSize: 20,
  };

  @observable
  applyMap = {};

  constructor(ctx, state) {
    this.applyAPI = new ApplyAPI(ctx);

    if (state) {
    }
  }

  @action
  fetchApplyList = async (pageNum, pageSize) => {
    const result = await this.applyAPI.fetchApplyList(pageNum, pageSize);
    this.applyList = result;
    return result;
  };

  saveApply(apply) {
    if (apply.id) {
      return this.applyAPI.updateApply(apply);
    } else {
      return this.applyAPI.createApply(apply);
    }
  }

  updateApplyStatus(id, status) {
    return this.applyAPI.updateApplyStatus(id, status);
  }

  @action
  fetchApplyMap = async () => {
    const r = await this.applyAPI.fetchApplyMap();
    this.applyMap = r;
  };
}

export default ApplyStore;

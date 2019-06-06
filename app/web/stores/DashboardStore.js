import { action, observable, computed } from 'mobx';
import DashboardAPI from 'api/dashboard';

export default class DashboardStore {
  @observable _historyList = [];
  @computed.struct get historyList() {
    return this._historyList;
  }

  constructor(ctx, state) {
    this.DashboardAPI = new DashboardAPI(ctx);

    if (state) {

    }
  }

  @action getHistoryList = async (params) => {
    const result = await this.DashboardAPI.getHistoryList(params);
    this._historyList = result;
    return result;
  };

}

const BaseFrontendWatchmanAPI = require('./base_fw_api');

class DashboardAPI extends BaseFrontendWatchmanAPI {
  getHistoryList(params) {
    return this.post('/dashboard/history', params);
  }
}

export default DashboardAPI;

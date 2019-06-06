const BaseFrontendWatchmanAPI = require('./base_fw_api');

class ApplyAPI extends BaseFrontendWatchmanAPI {
  fetchApplyList(pageNum, pageSize) {
    return this.get('/apply', { pageNum, pageSize });
  }

  udpateApply(apply) {
    return this.put(`/apply/${apply.id}`, apply);
  }

  createApply(apply) {
    return this.post('/apply', apply);
  }

  updateApplyStatus(id, status) {
    return this.put(`/apply/${id}/status`, { status });
  }

  fetchApplyMap() {
    return this.get(`/apply/map`, {});
  }
}

export default ApplyAPI;

const BaseFrontendWatchmanAPI = require('./base_fw_api');

class LogAPI extends BaseFrontendWatchmanAPI {
  fetchLogList(pageNum, pageSize, filter) {
    return this.post('/log', { pageNum, pageSize, filter });
  }

  parseErrStack(params) {
    const finalParams = new FormData();
    [params.file.file].forEach((value, key) => {
      finalParams.append(key, value);
    });
    return this.post(`/log/parse?errStack=${params.errStack}`, finalParams, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export default LogAPI;

const axios = require('axios');

class BaseAPI {
  constructor(config) {
    const { baseURL, defaultOptions } = config;
    const httpclient = axios.create({ baseURL, ...defaultOptions });

    this.httpclient = httpclient;
    this.config = config;
  }

  curl(path, options = {}) {
    const { defaultOptions } = this.config;
    const finalOptions = Object.assign({
      url: path,
    }, defaultOptions, options);
    return this.httpclient(finalOptions);
  }

  post(path, data, options = {}) {
    return this.curl(path, {
      ...options,
      method: 'POST',
      data,
    });
  }

  get(path, data, options = {}) {
    return this.curl(path, {
      ...options,
      method: 'GET',
      params: data,
    });
  }

  put(path, data, options = {}) {
    return this.curl(path, {
      ...options,
      method: 'PUT',
      data,
    });
  }

  delete(path, data, options = {}) {
    return this.curl(path, {
      ...options,
      method: 'DELETE',
      data,
    })
  }
}

BaseAPI.IS_NODE = typeof window === 'undefined';

module.exports = BaseAPI;

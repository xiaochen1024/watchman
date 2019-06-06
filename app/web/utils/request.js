import axios from 'axios';
import queryString from 'query-string';
import _ from 'lodash';
import server from 'server';
import { message } from 'antd';

// const queryParams = queryString.parse(location.search);
const defaultParams = {};

axios.defaults.data = defaultParams;
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  // const token = storage.getItem(TOKEN_KEY);
  const configTemp = config;
  // if (token) {
  //   configTemp.headers.Authorization = `leaf ${token}`;
  // } else {
  //   delete configTemp.headers.Authorization;
  // }
  return configTemp;
}, error => Promise.reject(error));

axios.interceptors.response.use(response => {
  if (response.data.status !== 0) {
    message.error(response.data.msg);
    if (response.data.status === 10) {
      window.location.replace(`${server.h5root}/login`);
    }
    return Promise.reject(response);
  }
  return response.data.data;
}, error => {
  const { config, response } = error;
  const { status } = error.response;

  if (status === 403 || status === 401) {
    window.location.replace(`${server.h5root}/login`);
    return Promise.reject(response);
  }

  if (config.showError) {
    message.error(response.data.errorMsg, 3);
  }
  return Promise.reject(response);
});

export default {
  post(url, params, config) {
    const configTemp = _.merge({
      showError: true,
    }, config);

    let paramsTemp = params;

    const contentType = (configTemp.headers && configTemp.headers['Content-Type']) || 'application/json';
    switch (contentType) {
    case 'application/json':
      paramsTemp = JSON.stringify(params);
      break;
    case 'application/x-www-form-urlencoded':
      paramsTemp = queryString.stringify(paramsTemp);
      break;
    default:
      break;
    }

    return axios.post(url, paramsTemp, configTemp);
  },
  get(url, params, config) {
    const configTemp = _.merge({
      showError: true,
    }, config);
    return axios.get(url, {
      params,
    }, configTemp);
  },
  put(url, params, config) {
    const configTemp = _.merge({
      showError: true,
    }, config);
    return axios.put(url, queryString.stringify(params), configTemp);
  },
  delete(url, params, config) {
    const configTemp = _.merge({
      showError: true,
    }, config);
    return axios.delete(url, queryString.stringify(params), configTemp);
  },
};

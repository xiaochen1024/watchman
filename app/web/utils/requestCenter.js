import { message } from 'antd';
import shortId from 'shortid';

import BusinessError from 'api/error/business_error';
import HTTPError from 'api/error/http_error';

class RequestCenter {
  requestMap = new Map();

  async listen(requestPromise, options = {}) {
    const opts = Object.assign({
      showLoading: false,
      loadingText: '加载中...',
      showError: true,
      errorText: '系统繁忙，请稍后重试',
      hideLoadingTip: null,
      hideErrorTip: null,
    }, options);
    const id = shortId.generate();

    this.requestMap.set(id, opts);

    if (opts.showLoading) {
      opts.hideLoadingTip = message.loading(opts.loadingText);
    }

    try {
      const result = await requestPromise;
      return result;
    } catch (err) {
      if (opts.showError) {
        if (err instanceof BusinessError) {
          opts.hideErrorTip = message.error(err.data.msg || opts.errorText);
        }
      }

      if (err instanceof HTTPError) {
        if (err.status === 401) {
          const { pathname, search } = window.location;
          window.location.href = `/user/login?from=${encodeURIComponent(pathname + search)}`;
        } else if (err.status === 422 || err.status === 500) {
          opts.hideErrorTip = message.error(err.data.msg || opts.errorText);
        }
      }

      throw err;
    } finally {
      if (this.requestMap.has(id)) {
        this.requestMap.delete(id);
        opts.hideLoadingTip && opts.hideLoadingTip();
      }
    }
  }

  reset() {
    /* eslint-disable no-restricted-syntax */
    for (const opts of this.requestMap.values()) {
      opts.hideLoadingTip && opts.hideLoadingTip();
      opts.hideErrorTip && opts.hideErrorTip();
    }
    /* eslint-enable no-restricted-syntax */

    this.requestMap.clear();
  }
}

export default new RequestCenter();

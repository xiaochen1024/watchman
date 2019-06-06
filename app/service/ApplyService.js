const { Service } = require('egg');

const { APPLY_REVIEWING } = require('../enum/ApplyStatus');

const REG_DOMAIN_STAR = /^\*(\.[^\/]+)?$/;
const REG_REFERER = /^https?:\/\/[^\/]+\//i;

class ApplyService extends Service {
  constructor(ctx) {
    super(...arguments);
    this.ApplyModel = ctx.model.ApplyModel;
    this.ServerResponse = ctx.response.ServerResponse;
    this.BusinessCode = ctx.response.BusinessCode;
  }

  async createApply(apply) {
    const { ApplyModel, ServerResponse } = this;
    const errorMsg = '创建申请失败';

    if (!REG_DOMAIN_STAR.test(apply.url) && !REG_REFERER.test(apply.url)) {
      return ServerResponse.createByErrorMsg('申请接入URL不合法');
    }

    apply.status = APPLY_REVIEWING;

    try {
      const result = await ApplyModel.create(apply);
      if (result) {
        return ServerResponse.createBySuccessMsgAndData('创建申请成功', result);
      }
      return ServerResponse.createByErrorMsg(errorMsg);
    } catch (err) {
      this.app.logger.error(errorMsg, err);
      return ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  async updateApply(apply) {
    const { ApplyModel, ServerResponse } = this;
    const errorMsg = '更新申请失败';

    if (!REG_DOMAIN_STAR.test(apply.url) && !REG_REFERER.test(apply.url)) {
      return ServerResponse.createByErrorMsg('申请接入URL不合法');
    }

    try {
      const apply = await ApplyModel.update(apply, {
        fields: ['url', 'description'],
        where: { id: apply.id },
      });
      if (apply) {
        return ServerResponse.createBySuccessMsgAndData('更新申请成功', apply);
      }
      return ServerResponse.createByErrorMsg(errorMsg);
    } catch (err) {
      return ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  async updateStatus(id, status) {
    const { ApplyModel, ServerResponse } = this;
    const errorMsg = '更新申请状态失败';

    try {
      const [rows] = await ApplyModel.update({ status }, { where: { id } });

      if (rows > 0) {
        return ServerResponse.createBySuccessMsg('更新申请状态成功');
      }

      return ServerResponse.createByErrorMsg(errorMsg);
    } catch (err) {
      this.app.logger.error(errorMsg, apply, error);
      return ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  async fetchListByStatus(status) {
    return await this.ApplyModel.findAll({ where: { status } });
  }

  async fetchListByUser(user, pageNum = 1, pageSize = 20) {
    const errorMsg = '获取申请列表失败';
    const { ApplyModel, ServerResponse } = this;
    try {
      const { rows, count } = await ApplyModel.findByUserName(
        user.userName,
        pageNum,
        pageSize
      );
      const responseData = {
        list: rows,
        total: count,
        pageNum,
        pageSize,
      };
      return ServerResponse.createBySuccessData(responseData);
    } catch (err) {
      this.app.logger.error(errorMsg, err);
      return ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  async fetchListByAdmin(pageNum = 1, pageSize = 20) {
    const { ApplyModel, ServerResponse } = this;
    try {
      const { rows, count } = await this.ApplyModel.findAndCount({
        offset: pageSize * (pageNum - 1),
        limit: pageSize,
      });
      const responseData = {
        list: rows,
        total: count,
        pageNum,
        pageSize,
      };
      return ServerResponse.createBySuccessData(responseData);
    } catch (err) {
      return ServerResponse.createByErrorMsg('获取申请列表失败');
    }
  }

  async getApplyMap() {
    const rows = await this.ApplyModel.findAll({
      attributes: ['id', 'name'],
    });
    const result = {};
    rows.forEach(v => {
      result[v.id] = v.name;
    });
    return this.ServerResponse.createBySuccessData(result);
  }
}

module.exports = ApplyService;

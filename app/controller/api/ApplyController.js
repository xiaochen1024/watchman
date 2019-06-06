const { Controller } = require('egg');
const _ = require('lodash');

const { ROLE_ADMIN } = require('../../enum/Role');
const { APPLY_APPROVED, APPLY_REJECTED } = require('../../enum/ApplyStatus');

class ApplyController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.applyService = ctx.service.applyService;
  }

  async index() {
    const { ctx, applyService } = this;
    const rules = {
      pageNum: 'int',
      pageSize: 'int',
    };
    const currentUser = ctx.session.currentUser;

    ctx.validate(rules, ctx.query);

    const { pageNum, pageSize } = ctx.query;
    let response;
    if (currentUser.role === ROLE_ADMIN) {
      response = await applyService.fetchListByAdmin(pageNum, pageSize);
    } else {
      response = await applyService.fetchListByUser(
        currentUser,
        pageNum,
        pageSize
      );
    }
    ctx.body = response;
  }

  async show() {}

  async edit() {}

  async create() {
    const { ctx, applyService } = this;
    const currentUser = ctx.session.currentUser;

    const rules = {
      name: 'string',
      url: 'string',
      description: 'string?',
      userName: 'string',
    };
    const apply = {
      ..._.pick(ctx.request.body, ['name', 'url', 'description']),
      userName: currentUser.userName,
    };

    ctx.validate(rules, apply);

    const response = await applyService.createApply(apply);
    ctx.body = response;
  }

  async update() {
    const { ctx, applyService } = this;
    const currentUser = ctx.session.currentUser;

    const rules = {
      id: 'string',
      url: 'string',
      description: 'string?',
      userName: 'string',
    };
    const apply = {
      ..._.pick(ctx.request.body, ['id', 'url', 'description']),
      userName,
    };

    ctx.validate(rules, apply);

    const response = await applyService.updateApply(apply);
    ctx.body = response;
  }

  async delete() {}

  async updateStatus() {
    const { ctx, applyService } = this;
    const rules = {
      id: 'string',
      status: [APPLY_APPROVED, APPLY_REJECTED],
    };
    const { status } = ctx.request.body;
    const id = ctx.params.id;

    ctx.validate(rules, { id, status });

    const response = await applyService.updateStatus(id, status);
    ctx.body = response;
  }

  async getApplyMap() {
    const { ctx } = this;
    const response = await this.applyService.getApplyMap();
    ctx.body = response;
  }
}

module.exports = ApplyController;

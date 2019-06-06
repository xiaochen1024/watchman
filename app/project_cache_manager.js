const { APPLY_APPROVED } = require('./enum/ApplyStatus');

const REG_DOMAIN = /^(?:https?:)?(?:\/\/)?([^\/]+\.[^\/]+)\/?/i;

const get_domain = function(url){
  return (url.toString().match(REG_DOMAIN) || ['', ''])[1].replace(/^\*\./, '');
};

const genBlacklistReg = function(data){
  // ip黑名单正则
  const blacklistIPRegExpList = [];
  (data.blacklist &&  data.blacklist.ip ? data.blacklist.ip : []).forEach(function (reg) {
    blacklistIPRegExpList.push(new RegExp("^" + reg.replace(/\./g , "\\.")) );
  });
  data.blacklistIPRegExpList = blacklistIPRegExpList

  // ua黑名单正则
  const blacklistUARegExpList = [];
  (data.blacklist && data.blacklist.ua ? data.blacklist.ua : []).forEach(function (reg) {
    blacklistUARegExpList.push(new RegExp(reg , "i"));
  });
  data.blacklistUARegExpList = blacklistUARegExpList

};

class ProjectCacheManager {
  cache = {};

  constructor(options) {

  }

  getProject(id) {
    return this.cache[id];
  }

  getAllProjects() {
    return this.cache;
  }

  pushProject(project) {
    const id = project.id;
    if (id) {
      project.domain = get_domain(project.url);
      genBlacklistReg(project);
      this.cache[id] = project;
    }
  }

  removeProject(id) {
    const project = this.cache[id];
    if (project) {
      delete this.cache[id];
    }
  }

  clearCache() {
    this.cache = {};
  }
}

ProjectCacheManager.createProjectCache = async (config, app) => {

  const cache = new ProjectCacheManager(config);

  app.beforeStart(async () => {
    const rows = await app.model.ApplyModel.findAll({
      where: { status: APPLY_APPROVED },
    });


    for (const r of rows) {
      const project = r.toJSON();
      cache.pushProject(project);
    }
  });

  return cache;
};

module.exports = ProjectCacheManager;

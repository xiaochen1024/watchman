const fs = require('fs');
const path = require('path');
const { Controller } = require('egg');

class DemoController extends Controller {
  demo() {
    const { ctx } = this;
    const html = fs.readFileSync(path.join(ctx.app.baseDir, 'app/view/demo.html'), { encoding: 'utf8' });
    ctx.body = html;
  }
}

module.exports = DemoController;
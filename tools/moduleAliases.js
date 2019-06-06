const path = require('path');

const root = [path.resolve(__dirname, '..')];
const env = process.env.NODE_ENV;

module.exports.babel = {
  root,
  alias: {
    api: './app/api',
    enums: './app/enum',
    framework: './app/web/framework',
    components: './app/web/components',
    constants: './app/web/constants',
    images: './app/web/images',
    stores: './app/web/stores',
    styles: './app/web/styles',
    utils: './app/web/utils',
  },
};

module.exports.webpack = {
  root,
  alias: {
    api: 'app/api',
    enums: 'app/enum',
    framework: 'app/web/framework',
    components: 'app/web/components',
    constants: 'app/web/constants',
    images: 'app/web/images',
    stores: 'app/web/stores',
    styles: 'app/web/styles',
    utils: 'app/web/utils',
  },
};

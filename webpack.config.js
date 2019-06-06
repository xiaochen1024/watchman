const process = require('process');

const env = process.env.NODE_ENV;

module.exports = {
  egg: true,
  framework: 'react',
  devtool: env === 'development' ? 'source-map' : false,
  publicPath: env === 'development' ? '/public/' : '/static/',
  entry: {
    include: [
      'app/web/page',
      { layout: 'app/web/framework/layout/layout.jsx?loader=false' },
      { login: 'app/web/page/login.jsx?loader=false' },
      { home: 'app/web/page/home.jsx?loader=false' },
    ],
    exclude: [ 'app/web/page/test' ],
    loader: {
      server: 'app/web/framework/entry/server-loader.js',
      client: 'app/web/framework/entry/client-loader.js',
    },
  },
  alias: {
    components: 'app/web/components',
    constants: 'app/web/constants',
    framework: 'app/web/framework',
    images: 'app/web/images',
    server: `app/web/server/${env}.js`,
    stores: 'app/web/stores',
    styles: 'app/web/styles',
    utils: 'app/web/utils',
  },
  dll: [ 'react', 'react-dom' ],
  loaders: {
    scss: true,
    less: true,
  },
  plugins: {

  },


  done() {
    console.log('---webpack compile finish---');
  },
};


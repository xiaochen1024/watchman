import url from 'url';
import path from 'path';
import process from 'process';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import merge from 'lodash/merge';
import nodeExternals from 'webpack-node-externals';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

import * as utils from '../utils';
import moduleAliases from '../../tools/moduleAliases';

const SUPPORT_BROWSERS = [ 'Android >= 4.4.4', 'iOS >= 9' ];
const GLOBALS = {
  __DEV__: process.env.NODE_ENV === 'development',
  EASY_ENV_IS_DEV: process.env.NODE_ENV === 'development',
  EASY_ENV_IS_NODE: true,
};

const env = process.env.NODE_ENV;
const isDev = process.env.NODE_ENV === 'development';
const baseDir = process.cwd();
const outputPath = 'app/view';

const babelLoaderConfig = {
  loader: 'babel-loader',
  options: {
    babelrc: false,
    cacheDirectory: '.tmp/babel-loader',
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          targets: { node: '8.11' },
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      [ '@babel/plugin-proposal-decorators', { legacy: true }],
      [ '@babel/plugin-proposal-class-properties', { loose: true }],
      [ '@babel/plugin-proposal-optional-chaining', { loose: true }],
      [ 'import', { libraryName: 'antd' }],
    ],
  },
};

const entryConfig = {
  include: [
    'app/web/page',
    { layout: 'app/web/framework/layout/layout.jsx' },
  ],
  exclude: [ 'app/web/page/test' ],
};

const normalEntries = utils.getEntry(entryConfig, baseDir);
const entries = merge({}, normalEntries);

export default {
  target: 'node',
  context: baseDir,
  entry: entries,
  externals: [ nodeExternals() ],
  output: {
    path: path.join(baseDir, outputPath),
    publicPath: '/public/',
    filename: '[name].js',
    chunkFilename: '[name].js',
    libraryTarget: 'commonjs',
  },
  plugins: [
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),
    new MiniCSSExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        oneOf: [
          {
            resourceQuery: /layout/,
            use: [ babelLoaderConfig, require.resolve('../loaders/serverLayoutLoader') ],
          }, {
            use: [ babelLoaderConfig ],
          },
        ],
      }, {
        test: /\.css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: isDev, modules: false },
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
              plugins: () => [ autoprefixer({ browsers: SUPPORT_BROWSERS }) ],
            },
          },
        ],
      }, {
        test: /\.less$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: isDev, modules: false },
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
              plugins: () => [ autoprefixer({ browsers: SUPPORT_BROWSERS }) ],
            },
          }, {
            loader: 'less-loader',
            options: { javascriptEnabled: true, sourceMap: isDev },
          },
        ],
      }, {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader',
            options: { sourceMap: isDev, modules: false },
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
              plugins: () => [ autoprefixer({ browsers: SUPPORT_BROWSERS }) ],
            },
          }, {
            loader: 'sass-loader',
            options: { sourceMap: isDev },
          },
        ],
      }, {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?(#\S*)?$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: { name: 'styles/fonts/[name].[ext]' },
      }, {
        test: /\.(png|jp(e)?g|gif)$/,
        exclude: /node_modules\/(?!(pdfjs-dist)\/).*/,
        loader: 'file-loader',
        options: { name: 'images/[name].[ext]' },
      },
    ],
  },
  resolve: {
    extensions: [ '.jsx', '.js' ],
    modules: ['node_modules'].concat(moduleAliases.webpack.root),
    alias: moduleAliases.webpack.alias,
  },
};

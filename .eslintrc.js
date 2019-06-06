const path = require('path');
const moduleAliases = require('./tools/moduleAliases');

module.exports = {
  root: true,
  extends: 'airbnb',
  env: {
    'es6': true,
    'browser': true,
    'node': true,
  },
  parser: 'babel-eslint',
  plugins: ['babel'],
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      experimentalDecorators: true,
    },
  },
  globals: {
    __CHANNEL__: false,
    __IS__APP__: false
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        root: moduleAliases.babel.root,
        alias: moduleAliases.babel.alias
      }
    }
  },
  'rules': {
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-unused-expressions': ['error', { 'allowShortCircuit': true }],
    'class-methods-use-this': 'warn',
    'no-underscore-dangle': 'warn',
    'no-lonely-if': 'warn',
    'react/prop-types': 'off',
    'react/no-multi-comp': 'warn',
    'react/prefer-stateless-function': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'import/no-extraneous-dependencies': 'off',
  }
};

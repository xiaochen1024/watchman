import webpackMerge from 'webpack-merge';
import cloneDeep from 'lodash/cloneDeep';
import commandLineArgs from 'command-line-args';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import StatsPlugin from 'stats-webpack-plugin';
import _ from 'lodash';

import webpackBaseConfig from './webpackBaseConfig';

const optionDefinitions = [
  { name: 'analyze', type: Boolean, defaultValue: false },
  { name: 'stats', type: Boolean, defaultValue: false },
];
const options = commandLineArgs(optionDefinitions);
const baseConfig = cloneDeep(webpackBaseConfig);
const plugins = [];

if (options.analyze) {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: '8888',
    openAnalyzer: false,
  }));
}

if (options.stats) {
  plugins.push(new StatsPlugin('stats.json', { chunkModules: true }));
}

let finalConfig = baseConfig; // eslint-disable-line import/no-mutable-exports

// Merge common configuration
finalConfig = webpackMerge(finalConfig, {
  parallelism: 1,
  profile: options.stats,
});

// Merge plugins
finalConfig = webpackMerge({
  customizeArray(a, b, key) {
    if (key === 'plugins') {
      return _.uniqBy(
        [ ...b, ...a ],
        plugin => plugin.constructor || plugin.constructor.name
      );
    }

    return undefined;
  },
})(finalConfig, { plugins });

// Merge loaders
finalConfig = webpackMerge.smart(finalConfig, {
  mode: 'production',
});

export default finalConfig;

/* eslint-disable */

/**
 一个自定义的babel-jest，配置了一些我们zent项目里用到的babel presets和plugins。这么做的原因
 主要是想把Jest的依赖包从各个zent组件中移除。

 代码修改自 https://github.com/facebook/jest/blob/master/packages/babel-jest/src/index.js
*/

/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 *
 */

'use strict';

var babel = require('babel-core');
var crypto = require('crypto');
var fs = require('fs');
var jestPreset = require('babel-preset-jest');
var path = require('path');

var babelPackages = require('../webpack/babelPackages');

var BABELRC_FILENAME = '.babelrc';

var cache = Object.create(null);

var getBabelRC = function getBabelRC(filename, _ref) {
  var useCache = _ref.useCache;

  var paths = [];
  var directory = filename;
  while (directory !== (directory = path.dirname(directory))) {
    if (useCache && cache[directory]) {
      break;
    }

    paths.push(directory);
    var configFilePath = path.join(directory, BABELRC_FILENAME);
    if (fs.existsSync(configFilePath)) {
      cache[directory] = fs.readFileSync(configFilePath, 'utf8');
      break;
    }
  }
  paths.forEach(function (directoryPath) {
    cache[directoryPath] = cache[directory];
  });

  return cache[directory] || '';
};

var createTransformer = function createTransformer(options) {
  options = Object.assign({}, options, {
    auxiliaryCommentBefore: ' istanbul ignore next ',
    presets: (options && options.presets || [])
        .concat(babelPackages.presets.map(require.resolve))
        .concat([jestPreset]),
    plugins: ((options && options.plugins) || [])
        .concat(babelPackages.plugins.map(require.resolve)),
    retainLines: true
  });
  delete options.cacheDirectory;

  return {
    canInstrument: true,
    getCacheKey: function getCacheKey(fileData, filename, configString, _ref2) {
      var instrument = _ref2.instrument,
          watch = _ref2.watch;

      return crypto.createHash('md5').update(fileData).update(configString)
      // Don't use the in-memory cache in watch mode because the .babelrc
      // file may be modified.
      .update(getBabelRC(filename, { useCache: !watch })).update(instrument ? 'instrument' : '').digest('hex');
    },
    process: function process(src, filename, config, transformOptions) {
      var plugins = options.plugins || [];

      if (transformOptions && transformOptions.instrument) {
        // Copied from jest-runtime transform.js
        plugins = plugins.concat([[require('babel-plugin-istanbul').default, {
          // files outside `cwd` will not be instrumented
          cwd: config.rootDir,
          exclude: []
        }]]);
      }

      if (babel.util.canCompile(filename)) {
        return babel.transform(src, Object.assign({}, options, { filename: filename, plugins: plugins })).code;
      }
      return src;
    }
  };
};

module.exports = createTransformer();
module.exports.createTransformer = createTransformer;

// var babel = require('babel-core');
// var babelPackages = require('../webpack/babelPackages');

// var createTransformer = function(options) {
//     options = Object.assign({}, options, {
//         auxiliaryCommentBefore: ' istanbul ignore next ',
//         presets: ((options && options.presets) || []).concat(
//             ['babel-preset-jest'].concat(babelPackages.presets).map(require.resolve)
//         ),
//         plugins: ((options && options.plugins) || []).concat(babelPackages.plugins.map(require.resolve)),
//         retainLines: true
//     });
//     devare options.cacheDirectory;

//     return {
//         canInstrument: true,
//         process: function(src, filename, config, preprocessorOptions) {
//             var plugins = options.plugins || [];

//             // 这个参数是为了兼容新版的jest-runtime，现在还没发布
//             // if (preprocessorOptions && preprocessorOptions.instrument) {
//             plugins = plugins.concat(require('babel-plugin-istanbul').default);
//             // }

//             if (babel.util.canCompile(filename)) {
//                 return babel.transform(
//                     src,
//                     Object.assign({}, options, {
//                         filename: filename,
//                         plugins: plugins
//                     })
//                 ).code;
//             }
//             return src;
//         }
//     };
// };

// module.exports = createTransformer();
// module.exports.createTransformer = createTransformer;

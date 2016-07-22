// var LiveReloadPlugin = require('webpack-livereload-plugin');
// var precss = require('precss');
// var autoprefixer = require('autoprefixer');
// var postcssImport = require('postcss-import');

// module.exports = function(entry, output) {
//     var webpackBase = require('./webpack.base.js')(entry, output);
//     var webpackConfig = {
//         watch: true,
//         devtool: 'source-map',
//         postcss: function (webpack) {
//             return [
// 				postcssImport({ addDependencyTo: webpack }),
// 				precss,
// 				autoprefixer
// 			];
//         },
//         plugins:[new LiveReloadPlugin()]
//     };
//
//     return Object.assign({}, webpackBase, webpackConfig);
// };

module.exports = function(entry, output) {
    var arr = output.split('/');
    var lab = arr[arr.length - 3];
    var webpackBase = require('./webpack.base.js')(entry, output);

    var webpackConfig = {
        output: {
          filename: 'main.js',
          path: output,
          library: lab,
          libraryTarget: 'umd'
        }
    };

    return Object.assign({}, webpackBase, webpackConfig, {});
};

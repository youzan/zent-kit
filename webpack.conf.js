var LiveReloadPlugin = require('webpack-livereload-plugin');
var path = require('path');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var babelLoader = path.resolve(__dirname, './node_modules/babel-loader') + '?stage=0';
var cssLoader = path.resolve(__dirname, './node_modules/css-loader');
var styleLoader = path.resolve(__dirname, './node_modules/style-loader');
var lessLoader = path.resolve(__dirname, './node_modules/less-loader');
var postcssLoader = path.resolve(__dirname, './node_modules/postcss-loader') + '?stage=0';

module.exports = function(entry, output) {
    var webpackConfig = {
        watch: true,
        module: {
            loaders: [
                { test: /\.(es6|js|jsx)$/, loader: babelLoader},
                { test: /\.less$/, loader: styleLoader + '!' + lessLoader },
                { test: /\.scss$/, loader: cssLoader + '!' + postcssLoader}
            ]
        },
        postcss: function () {
            return [precss, autoprefixer];
        },
        entry: [
            entry
        ],
        output: {
          filename: 'main.js',
          path: output
        },
        resolve: {
          extensions: ['', '.js', '.jsx'],
        },
        devtool: 'source-map',
        plugins:[new LiveReloadPlugin()]
    };

    return webpackConfig;
};

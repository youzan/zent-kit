var path = require('path');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var babelLoader = path.resolve(__dirname, './node_modules/babel-loader') + '?stage=0';
var cssLoader = path.resolve(__dirname, './node_modules/css-loader');
var styleLoader = path.resolve(__dirname, './node_modules/style-loader');
// var lessLoader = path.resolve(__dirname, './node_modules/less-loader');
var postcssLoader = path.resolve(__dirname, './node_modules/postcss-loader');

// var lessArr = [styleLoader, cssLoader, lessLoader];
var sassArr = [styleLoader, cssLoader, postcssLoader];

module.exports = function(entry, output) {
    var webpackConfig = {
        module: {
            loaders: [
                { test: /\.(es6|js|jsx)$/, loader: babelLoader},
                // { test: /\.less$/, loader: lessArr.join('!')},
                { test: /\.scss$/, loader: sassArr.join('!')}
            ]
        },
        postcss: function () {
            return [precss, autoprefixer];
        },
        externals: {
          "react": "react"
        },
        entry: [
            entry
        ],
        output: {
          filename: 'main.js',
          path: output,
          libraryTarget: 'umd'
        },
        resolve: {
          extensions: ['', '.js', '.jsx'],
        }
    };

    return webpackConfig;
};

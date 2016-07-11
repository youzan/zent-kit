var path = require('path');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var babelLoader = path.resolve(__dirname, '../node_modules/babel-loader');
var cssLoader = path.resolve(__dirname, '../node_modules/css-loader');
var styleLoader = path.resolve(__dirname, '../node_modules/style-loader');
var postcssLoader = path.resolve(__dirname, '../node_modules/postcss-loader');
var urlLoader = path.resolve(__dirname, '../node_modules/url-loader');

var sassArr = [styleLoader, cssLoader, postcssLoader];

module.exports = function(entry, output) {
    var webpackConfig = {
        module: {
            loaders: [
                {
                    test: /\.(es6|js|jsx)$/, loader: babelLoader,
                    query: {
                        presets: ['es2015', 'react', 'stage-1']
                    }
                },
                { test: /\.(png|jpg|jpeg)$/, loader: urlLoader},
                { test: /\.(css|scss)$/, loader: sassArr.join('!')}
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
        }
    };

    return webpackConfig;
};

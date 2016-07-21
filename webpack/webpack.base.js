var path = require('path');
var __path = function(item) {
    return path.resolve(__dirname, '../node_modules', item);
}

var babelLoader = __path('babel-loader');
var cssLoader = __path('css-loader');
var styleLoader = __path('style-loader');
var postcssLoader = __path('postcss-loader');
var urlLoader = __path('url-loader');

var add_module_exports = __path('babel-plugin-add-module-exports');
var transform_decorators_legacy = __path('babel-plugin-transform-decorators-legacy');
var es2015 = __path('babel-preset-es2015');
var react = __path('babel-preset-react');
var stage_1 = __path('babel-preset-stage-1');

var sassArr = [styleLoader, cssLoader, postcssLoader];

module.exports = function(entry, output) {
    var webpackConfig = {
        module: {
            loaders: [
                {
                    test: /\.(es6|js|jsx)$/, loader: babelLoader,
                    query: {
                        presets: [es2015, react, stage_1],
                        plugins: [add_module_exports, transform_decorators_legacy]
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

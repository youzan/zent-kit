var LiveReloadPlugin = require('webpack-livereload-plugin');
var path = require('path');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var babelLoader = path.resolve(__dirname, './node_modules/babel-loader') + '?stage=0';
var cssLoader = path.resolve(__dirname, './node_modules/css-loader');
var styleLoader = path.resolve(__dirname, './node_modules/style-loader');
var postcssLoader = path.resolve(__dirname, './node_modules/postcss-loader');
var urlLoader = path.resolve(__dirname, './node_modules/url-loader');
var postcssImport = require('postcss-import');

var sassArr = [styleLoader, cssLoader, postcssLoader];

module.exports = function(entry, output) {
    var webpackConfig = {
        watch: true,
        module: {
            loaders: [
                { test: /\.(es6|js|jsx)$/, loader: babelLoader},
                { test: /\.(png|jpg|jpeg)$/, loader: urlLoader},
                { test: /\.(css|scss)$/, loader: sassArr.join('!')}
            ]
        },
		postcss: function(webpack) {
	        return [
	            postcssImport({ addDependencyTo: webpack }), // Must be first item in list
				precss,
	            autoprefixer,
	        ];
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

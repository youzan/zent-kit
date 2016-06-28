var path = require('path');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var babelLoader = path.resolve(__dirname, './node_modules/babel-loader') + '?stage=0';
var cssLoader = path.resolve(__dirname, './node_modules/css-loader');
var styleLoader = path.resolve(__dirname, './node_modules/style-loader');
var postcssLoader = path.resolve(__dirname, './node_modules/postcss-loader');
var urlLoader = path.resolve(__dirname, './node_modules/url-loader');

var projectConf;

var defaultConf = {
    externals: [{
        'react': {
          amd: 'react',
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react'
        },
        'react-dom': 'ReactDOM'
    }]
};

try {
    projectConf = require(path.resolve(process.cwd(), './zent.webpack.config.js'));
} catch (ex) {
    projectConf = defaultConf;
}

var sassArr = [styleLoader, cssLoader, postcssLoader];

module.exports = function(entry, output) {
    var arr = output.split('/');
    var lab = arr[arr.length - 3];

    var webpackConfig = {
        module: {
            loaders: [
                { test: /\.(es6|js|jsx)$/, babelrc: false, babloader: babelLoader},
                { test: /\.(png|jpg|jpeg)$/, loader: urlLoader},
                { test: /\.scss$/, loader: sassArr.join('!')}
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
          path: output,
          library: lab,
          libraryTarget: 'umd'
        },
        resolve: {
          extensions: ['', '.js', '.jsx'],
        }
    };

    return Object.assign(webpackConfig, projectConf);
};

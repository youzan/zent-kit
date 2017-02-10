var sassArr = ['style-loader', 'css-loader', 'postcss-loader'].map(require.resolve);
sassArr[2] += '?parser=postcss-scss';

var postcssPlugin = require('./postcss.conf');
var babelPackages = require('./babelPackages');

module.exports = function(entry, output, env) {
    var packages = babelPackages[env];
    var webpackConfig = {
        module: {
            loaders: [{
                test: /\.(es6|js|jsx)$/, loader: require.resolve('babel-loader'),
                query: {
                    presets: packages.presets.map(require.resolve),
                    plugins: packages.plugins.map(require.resolve)
                }
            }, {
                test: /\.(png|jpg|jpeg)$/,
                loader: require.resolve('url-loader')
            }, {
                test: /\.(css|scss)$/,
                loader: sassArr.join('!')
            }
        ]},
        postcss: function(webpack) {
            return postcssPlugin;
        },
        entry: [entry],
        output: {
            filename: 'main.js',
            path: output
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    };

    return webpackConfig;
};

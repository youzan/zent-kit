var LiveReloadPlugin = require('webpack-livereload-plugin');
var postcssPlugin = require('./postcss.conf');

module.exports = function(entry, output) {
    var webpackBase = require('./webpack.base.js')(entry, output, 'build');
    var webpackConfig = {
        watch: true,

        // inline 到文件里面，否则 Chrome 中文有乱码
        devtool: 'inline-source-map',

        postcss: function(webpack) {
            return postcssPlugin;
        },
        plugins: [new LiveReloadPlugin()]
    };

    return Object.assign({}, webpackBase, webpackConfig);
};

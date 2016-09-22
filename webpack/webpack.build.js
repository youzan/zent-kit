var LiveReloadPlugin = require('webpack-livereload-plugin');
var postcssPlugin = require('./postcss.conf');

module.exports = function(entry, output) {
    var webpackBase = require('./webpack.base.js')(entry, output);
    var webpackConfig = {
        watch: true,
        // devtool: 'source-map',
        postcss: function(webpack) {
            return postcssPlugin(webpack, true);
        },
        plugins: [new LiveReloadPlugin()]
    };

    return Object.assign({}, webpackBase, webpackConfig);
};

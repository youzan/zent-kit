var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = function(entry, output) {
    var webpackBase = require('./webpack.base.js')(entry, output);
    var webpackConfig = {
        watch: true,
        devtool: 'source-map',
        plugins:[new LiveReloadPlugin()]
    };

    return Object.assign(webpackBase, webpackConfig);
};

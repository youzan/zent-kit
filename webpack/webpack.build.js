var LiveReloadPlugin = require('webpack-livereload-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var postcssImport = require('@youzan/postcss-import');

module.exports = function(entry, output) {
    var webpackBase = require('./webpack.base.js')(entry, output);
    var webpackConfig = {
        watch: true,
        devtool: 'eval-source-map',
        postcss: function(webpack) {
            return [
                postcssImport({
                    addDependencyTo: webpack,
                    extensions: [
                        '.scss',
                        '.css'
                    ]
                }),
                precss,
                autoprefixer
            ];
        },
        plugins: [new LiveReloadPlugin()]
    };

    return Object.assign({}, webpackBase, webpackConfig);
};

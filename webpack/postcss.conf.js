var precss = require('precss');
var autoprefixer = require('autoprefixer');
var postcssImport = require('@youzan/postcss-import');
var inlineComment = require('postcss-inline-comment');

module.exports = function(webpack, isDynamic) {
    var plugins = [];

    if (isDynamic) {
        plugins.push(postcssImport({
            addDependencyTo: webpack,
            extensions: [
                '.scss',
                '.css'
            ]
        }));
    } else {
        plugins.push(postcssImport({
            extensions: [
                '.scss',
                '.css'
            ]
        }));
    }

    plugins = plugins.concat([
        inlineComment,
        precss,
        autoprefixer
    ]);

    return plugins;
};

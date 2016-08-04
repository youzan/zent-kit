var precss = require('precss');
var autoprefixer = require('autoprefixer');
var postcssImport = require('@youzan/postcss-import');
var inlineComment = require('postcss-inline-comment');
var atVariables = require('postcss-at-rules-variables');
var atIf = require('postcss-conditionals');
var atEach = require('postcss-each');
var atFor = require('postcss-for');

module.exports = function(webpack, isDynamic) {
    var plugins = [];

    if (isDynamic) {
        plugins.push(postcssImport({
            addDependencyTo: webpack,
            plugins: [
                require('postcss-at-rules-variables'),
                require('@youzan/postcss-import')
            ],
            extensions: [
                '.scss',
                '.css'
            ]
        }));
    } else {
        plugins.push(postcssImport({
            addDependencyTo: webpack,
            extensions: [
                '.scss',
                '.css'
            ]
        }));
    }

    plugins = plugins.concat([
        inlineComment,
        atVariables,
        atEach,
        atFor,
        atIf,
        precss,
        autoprefixer
    ]);

    console.log(plugins);
    return plugins;
};

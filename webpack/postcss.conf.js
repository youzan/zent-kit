var precss = require('precss');
var autoprefixer = require('autoprefixer');
var postcssImport = require('postcss-easy-import');
var inlineComment = require('postcss-inline-comment');

module.exports = function(webpack, isDynamic) {
    // var plugins = [];

    // if (isDynamic) {
    //     plugins.push(postcssImport({
    //         addDependencyTo: webpack,
    //         extensions: [
    //             '.scss',
    //             '.css'
    //         ]
    //     }));
    // } else {
    //     plugins.push(postcssImport({
    //         extensions: [
    //             '.scss',
    //             '.css'
    //         ]
    //     }));
    // }

    return [
        postcssImport({
            extensions: [
                '.scss',
                '.css'
            ]
        }),
        inlineComment,
        precss,
        autoprefixer
    ];
};

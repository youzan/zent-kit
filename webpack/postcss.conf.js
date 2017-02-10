var precss = require('precss');
var autoprefixer = require('autoprefixer');
var postcssImport = require('postcss-easy-import');
var inlineComment = require('postcss-inline-comment');

module.exports = [
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

var common = {
    presets: [
        'babel-preset-es2015',
        'babel-preset-react',
        'babel-preset-stage-1'
    ],

    plugins: [
        'babel-plugin-add-module-exports',
        'babel-plugin-transform-decorators-legacy',

        // 防止有人误用Object.assign导致线上挂掉
        'babel-plugin-transform-object-assign',

        // 老浏览器上保险
        'babel-plugin-transform-es3-member-expression-literals',
        'babel-plugin-transform-es3-property-literals'
    ]
};

module.exports = {
    build: {
        presets: common.presets.slice(),
        plugins: common.plugins.slice()
    },

    prepublish: {
        presets: common.presets.slice(),

        plugins: common.plugins.concat([
            // 删掉这些没用的代码
            'babel-plugin-transform-remove-debugger',
            'babel-plugin-transform-remove-console'
        ])
    }
};

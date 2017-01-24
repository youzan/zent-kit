#!/usr/bin/env node

var path = require('path');
var ch = require('child_process');
var fs = require('fs');
var jsonfile = require('jsonfile');
var tmp = require('tmp');

function getJestAbsolutePath(filename) {
    return path.resolve(__dirname, '../jest', filename);
}

function getDefaultJestConfig() {
    var config = {
        automock: false,

        // statements和branches比较难做高，这些阈值我们先设置得低一些，后续可以慢慢调整。
        collectCoverage: true,
        coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
        coverageThreshold: {
            global: {
                statements: 60,
                branches: 50,
                functions: 85,
                lines: 90
            }
        },

        timers: 'fake',

        transform: {
            '.(js|jsx)$': getJestAbsolutePath('babel.js')
        }
    };

    // 测试的时候忽略所有require的资源文件
    var resourceExtensions = [
        'css', 'scss', 'less', 'sass',
        'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
        'eot', 'ttf', 'woff', 'woff2'
    ];
    var emptyModule = getJestAbsolutePath('empty-module.js');

    // Jest对moduleNameMapper的处理其实是value作为key的，所以一个模块只能对应一个正则。
    // 我们对扩展名做了忽略大小处理，所以看着比较复杂，效果等价于/^.*[.](css|less|...)$/i。
    // 例如我们只需要处理css和scss后缀，那么最终生成的正则表达式是这个样子的：
    // ^.*[.]([Cc][Ss][Ss]|[Ss][Cc][Ss][Ss])$
    var extRegexp = resourceExtensions.map(function(ext) {
        return ext.split('').map(function(c) {
            var lower = c.toLowerCase();
            var upper = c.toUpperCase();
            return lower === upper ? lower : '[' + lower + upper + ']';
        }).join('');
    }).join('|');
    var moduleNameMapper = config.moduleNameMapper = {};
    moduleNameMapper['^.*[.](' + extRegexp + ')$'] = emptyModule;

    return config;
}

/**
 支持的Jest配置有两个来源：当前project的package.json里的jest配置，以及我们默认的配置。
 默认的配置里面包含了一个自定义的babel-jest预处理脚本以及对资源文件的处理。

 项目里最好不要覆盖scriptPreprocessor。
*/
function resolveJestConfig() {
    var packageJSONFile = path.resolve(process.cwd(), 'package.json');
    var packageJestConfig = {};
    if (fs.statSync(packageJSONFile).isFile()) {
        var packageData = require(packageJSONFile);
        var packageJestConfig = packageData.jest || {};
    }

    return Object.assign(getDefaultJestConfig(), packageJestConfig);
}

module.exports = function(params) {
    // 生成Jest配置文件
    var jestConfigFile = tmp.tmpNameSync();
    var jestConfig = resolveJestConfig();
    jsonfile.writeFileSync(jestConfigFile, jestConfig, {spaces: 2});

    var jestBin = path.resolve(__dirname, '../node_modules/.bin/jest');
    var args = ['--config', jestConfigFile];
    var child = ch.spawn(jestBin, args.concat(params.split(' ')), {stdio: 'inherit'});

    // remove jest config file
    child.on('exit', function(code, signal) {
        fs.unlinkSync(jestConfigFile);
        process.exit(signal ? -1 : code);
    });
};

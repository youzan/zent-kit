#!/usr/bin/env node

var path = require('path');
var ch = require('child_process');
var fs = require('fs');
var mergeWith = require('lodash/mergeWith');
var assign = require('lodash/assign');
var jsonfile = require('jsonfile');

function getJestAbsolutePath(filename) {
    return path.resolve(__dirname, '../jest', filename);
}

function getDefaultJestConfig() {
    return {
        automock: false,
        scriptPreprocessor: getJestAbsolutePath('babel.js'),
        moduleNameMapper: {
            // Ignore all resource files when testing
            '^.*[.](css|CSS|less|LESS|SASS|sass|SCSS|scss|png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|webp|WEBP)$': getJestAbsolutePath('empty-module.js')
        }
    };
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

    var jestConfig = mergeWith(getDefaultJestConfig(), packageJestConfig, function(objValue, srcValue, key, object, source, stack) {
        if (key === 'moduleNameMapper') {
            return assign({}, objValue, srcValue);
        }
    });
    return jestConfig;
}

module.exports = function(params) {
    // 生成Jest配置文件
    var jestConfigFile = getJestAbsolutePath('config.json');
    var jestConfig = resolveJestConfig();
    jsonfile.writeFileSync(jestConfigFile, jestConfig, {spaces: 2});

    var jestBin = path.resolve(__dirname, '../node_modules/.bin/jest');
    var args = ['--config', jestConfigFile];
    var child = ch.spawn(jestBin, args.concat(params.split(' ')), {stdio: 'inherit'});

    // remove jest config file
    child.on('exit', function(code, signal) {
        fs.unlinkSync(jestConfigFile);
    });
};

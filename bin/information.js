#!/usr/bin/env node
var path = require('path');
var config = require('../package.json');
var logger = console.log.bind(console);

var loggerVersion = function() {
    logger('%s@%s\n', config.name, config.version)
}

module.exports = function(dir) {
    if (dir === 'version') {
        loggerVersion();
        return;
    }
    logger('\nUsage: zent-kit <command> [arguments]');
    logger('\nCommand:\n');
    logger('    init <name>     项目初始化');
    logger('    dev             开发者模式');
    logger('    prepublish      发布预处理');
    logger('    -v, --version   查看kit版本\n');
    loggerVersion();
    logger('    ', dir);
}

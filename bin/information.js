#!/usr/bin/env node
var config = require('../package.json');
var logger = console.log.bind(console);

var loggerVersion = function() {
    logger('Using %s@%s', config.name, config.version);
};

module.exports = function(dir) {
    if (dir === 'version') {
        loggerVersion();
        return;
    }

    logger('\nUsage: zent-kit <command> [arguments]');
    logger('\nCommand:');
    logger('    init <name>     项目初始化');
    logger('    dev             开发者模式');
    logger('    test            运行测试(Jest)');
    logger('    prepublish      发布预处理');
    logger('    get [names]     重获某个基础文件');
    logger('    pwd             查看使用中的 zent-kit 路径');
    logger('    -v, --version   查看kit版本\n');
    loggerVersion();
    logger('    from            %s\n', dir);
};

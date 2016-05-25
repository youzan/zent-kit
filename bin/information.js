#!/usr/bin/env node
var path = require('path');
var ch = require('child_process');
var config = require('../package.json');
var logger = console.log.bind(console);

var loggerVersion = function() {
    logger('Using %s@%s', config.name, config.version)
}

var exec = ch.exec;

module.exports = function(dir) {
    if (dir === 'version') {
        loggerVersion();
        return;
    }
    logger('\nUsage: zent-kit <command> [arguments]');
    logger('\nCommand:');
    logger('    init <name>     项目初始化');
    logger('    dev             开发者模式');
    logger('    prepublish      发布预处理');
    logger('    -v, --version   查看kit版本\n');
    loggerVersion();
    logger('    from            %s\n', dir);

    exec('which npm', function(err, stdout, stderr) {
        var Npath = stdout.toString().trim();
        var command = Npath + ' view --registry="http://registry.npm.qima-inc.com" @youzan/zent-kit version';
        exec(command, function(err, stdout, stderr) {
            logger('Latest Version %s    on              http://npm.qima-inc.com/', stdout);
        })
    });
}

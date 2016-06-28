#!/usr/bin/env node
var path = require('path');
var ch = require('child_process');
var gutil = require('gulp-util');
var config = require('../package.json');
var logger = console.log.bind(console);

var loggerVersion = function() {
    logger('Using %s@%s', config.name, config.version)
}

var logRepeat = function(func, version, time) {
    while(version > 0) {
        var t = time;
        while(t > 0) {
            func();
            t --;
        }
        version --;
    }
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
    logger('    get [names]     重获某个基础文件');
    logger('    pwd             查看使用中的 zent-kit 路径');
    logger('    -v, --version   查看kit版本\n');
    loggerVersion();
    logger('    from            %s\n', dir);

    exec('which npm', function(err, stdout, stderr) {
        var Npath = stdout.toString().trim();
        var command = Npath + ' view --registry="http://registry.npm.qima-inc.com" @youzan/zent-kit version';
        exec(command, function(err, stdout, stderr) {
            logger('Latest Version %s    on              http://npm.qima-inc.com/\n', stdout);

            // 对版本进行判别，这边的逻辑将来抽象出来
            var version = [];
            version.push(config.version.split('.'));
            version.push(stdout.split('.'));
            var versionM = version[1][2].slice(0, -1) - version[0][2];
            if (version[0][1] !== version[1][1] || version[0][0] !== version[1][0]) {
                versionM = 100;
            }

            if (versionM >= 10) {
                logRepeat(function() {
                    gutil.log(gutil.colors.red('! ! !：') + gutil.colors.yellow('当前版本已经严重落后，请尽快升级'));
                }, versionM, 10);
            } else if (versionM >= 5) {
                logRepeat(function() {
                    gutil.log(gutil.colors.yellow('~ ~ ~：') + gutil.colors.green('当前版本已经严重落后，请尽快升级'));
                }, versionM, 5);
            }
        })
    });
}

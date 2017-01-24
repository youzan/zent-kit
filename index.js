#!/usr/bin/env node
var gutil = require('gulp-util');
var ch = require('child_process');

var information = require('./bin/information');
var config = require('./package.json');

var logger = console.log.bind(console);

function checkUpdates(callback) {
    ch.exec('which npm', function(err, stdout, stderr) {
        if (err) {
            logger(gutil.colors.red(err));
            process.exit(1);
        }

        var Npath = stdout.toString().trim();
        var command = Npath + ' view --registry="http://registry.npm.qima-inc.com" @youzan/zent-kit version';
        ch.exec(command, function(err, stdout, stderr) {
            if (err) {
                logger(gutil.colors.red(err));
                process.exit(1);
            }

            var toVersionNumber = function(versionString) {
                return parseInt(versionString.trim().replace(/\./g, ''), 10);
            }

            var localVersion = toVersionNumber(config.version);
            var remoteVersion = toVersionNumber(stdout);

            if (localVersion < remoteVersion) {
                logger(gutil.colors.yellow('Update available, please upgrade to %s'), stdout.trim());
                logger(gutil.colors.gray('You have %s installed'), config.version);

                return;
            }

            callback();
        });
    });
}

function main() {
    var args = process.argv.splice(2);
    var operation = args.shift();
    var projectDir = process.cwd();
    var kitDir = __dirname;

    if (!operation) {
        information(kitDir);
        return;
    }

    if (projectDir === kitDir) {
        gutil.log(gutil.colors.red('-> 请勿在zent-kit目录下运行命令\n'));
        return;
    }


    switch (operation) {
        case 'init':
            var init = require('./bin/init');
            gutil.log(gutil.colors.green('-> 初始化项目\n'));
            init(args[0]);
            break;

        case 'dev':
            var dev = require('./bin/dev');
            gutil.log(gutil.colors.green('-> 开发者模式\n'));
            dev();
            break;

        case 'prepublish':
            var pre = require('./bin/prepublish');
            gutil.log(gutil.colors.green('-> 发布预处理\n'));
            pre();
            break;

        case 'get':
            var getter = require('./bin/get');
            gutil.log(gutil.colors.green('-> 更新文件\n'));
            getter(args);
            break;

        case 'pwd':
            logger('    current dir: %s\n        kit dir: %s', projectDir, kitDir);
            break;

        case 'test':
            var test = require('./bin/test');
            test(args.join(' '));
            break;

        case '-v':
        case '--version':
            information('version');
            break;

        default:
            information(kitDir);
    }
}

checkUpdates(main);

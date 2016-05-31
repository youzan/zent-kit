#!/usr/bin/env node
var gutil = require('gulp-util');
var information = require('./bin/information');
var logger = console.log.bind(console);
// 参数
var args = process.argv.splice(2);
var operation = args[0];
var projectDir = process.cwd();
var kitDir = __dirname;

logger('-------------------------------------------------->');

if (args.length === 0) {
    information(kitDir);
    return;
}

if (projectDir === kitDir) {
    gutil.log(gutil.colors.red('-> 请勿在zent-kit目录下运行命令\n'));
    return;
}


switch(operation) {
    case 'init':
        var init = require('./bin/init');
        gutil.log(gutil.colors.green('-> 初始化项目\n'));
        init(args[1]);
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
        args.shift();
        getter(args);
        break;

    case 'test':
        logger('    cuttent dir: %s\n        kit dir: %s', projectDir, kitDir);
        break;

    case '-v':
    case '--version':
        information('version');
        break;

    default:
        information(kitDir);
}

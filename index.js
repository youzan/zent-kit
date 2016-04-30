#!/usr/bin/env node
var args = process.argv.splice(2);
var projectDir = process.cwd();
var kitDir = __dirname;
var logger = console.log.bind(console);
var information = require('./bin/information');

logger('-------------------------------------------------->');

if (args.length === 0) {
    information(kitDir);
    return;
}

if (projectDir === kitDir) {
    logger('-> 请勿在zent-kit目录下运行命令');
    return;
}

var operation = args[0];

switch(operation) {
    case 'init':
        logger('-> 初始化项目\n');

        if (!args[1]) {
            logger('   sir: we need a project name');
            break;
        }
        var init = require('./bin/init');
        init(args[1]);

        break;
    case 'dev':
        logger('-> 开发者模式\n');

        var checkfile = require('./bin/checkfile');
        if (checkfile('examples')) {
            require('./bin/server');
            require('./bin/build');
        }

        break;
    case 'prepublish':
        logger('-> 发布预处理\n');

        require('./bin/prepublish');

        break;
    case 'test':
        logger(projectDir);
        logger(kitDir);

        break;
    case '-v':
    case '--version':
        information('version');

        break;
    default:
        information(kitDir);
}

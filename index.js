#!/usr/bin/env node
var args = process.argv.splice(2);

if (args.length === 0) {
    console.log('未传入任何参数');
    return;
}

var operation = args[0];
var init = require('./bin/init');

switch(operation) {
    case 'init':
        if (!args[1]) {
            return;
        }
        init(args[1]);
        break;
    case 'dev':
        console.log('开发模式');
        require('./bin/server');
        require('./bin/build');
        break;
    case 'prepublish':
        console.log('发布之前的预处理');
    case 'test':
        console.log(process.cwd());
        console.log(__dirname);
}

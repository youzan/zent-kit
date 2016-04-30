#!/usr/bin/env node
var  _            = require('lodash');
var  fs           = require('fs');
var  path         = require('path');
var  koa          = require('koa');
var  koarouter    = require('koa-router');
var  koastatic    = require('koa-static');
var  highlight    = require('highlight').Highlight;
var  marked       = require('marked');
var checkfile = require('./checkfile');
var logger = console.log.bind(console);

var app = koa(),
    router = koarouter();

var projectPath = process.cwd();
var paths = {
    sourcesPath: path.resolve(__dirname, '../sources'), //  服务端资源
    assetsPath: path.resolve(__dirname, '../assets'),   // 服务端静态资源
    tmp: path.resolve(__dirname, '../.tmp'),    // 服务端开发文件
    projectPath: projectPath   //  开发项目路径
};
var layout = fs.readFileSync(paths.sourcesPath + '/layout.html');


var files = fs.readdirSync(paths.projectPath + '/examples');
var navList = files.filter(function (filename) {
        return /.js$/.test(filename);
    }).map(function (filename) {
        return `/examples/${filename.split('.')[0]}`;
    });
navList.unshift('/readme');

// router: readme
router.get('/readme', function *(next) {
    logger('\n-------> GET: readme\n');

    var readmePath = checkfile('readme.md');
    var readme = readmePath ? fs.readFileSync(readmePath, 'utf8') : '';
    var data = {
        navList: navList,
        script: false,
        readme: marked(readme),
        code: false
    };
    this.body = _.template(layout)(data);
});

// router: examples
router.get('/examples/:example', function *(next) {
    var example = this.params.example;
    logger('\n-------> GET: example %s\n', example);

    var filePath = `${paths.projectPath}/examples/${example}.js`;
    var originFile = fs.readFileSync(filePath, 'utf8');
    var comments = [];
    var codes = [];

    // 以下逻辑读取examples里面的注释用
    originFile.split('*/').forEach(function(item) {
        var tmp = item.split('/*');
        comments.push(tmp[1]);
        if (tmp[0] !== '') {
            codes.push(tmp[0]);
        }
    });

    var data = {
        navList: navList,
        script: example,
        readme: marked(comments.join('')),
        code: highlight(codes.join(''))
    };

    this.body =  _.template(layout)(data);
});

// redirect
router.redirect('/', '/readme');

// 静态资源
app.use(koastatic(paths.assetsPath));
app.use(koastatic(path.join(paths.tmp, 'build')));
app.use(koastatic(path.join(paths.projectPath, 'src')));

// 启动路由
app.use(router.routes());

// 定义接口
var configPath = checkfile('package.json');
var config = configPath ? require(configPath) : {};
var port = (config.zent && config.zent.port) || 7777;


// 项目启动
app.listen(port);
logger('-------> Server started on %s', port);
logger('<--------------------------------------------------\n');

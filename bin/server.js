#!/usr/bin/env node

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var koa = require('koa');
var koarouter = require('koa-router');
var koastatic = require('koa-static');
var hljs = require('highlight.js');
var marked = require('marked');
var open = require('open');
var gutil = require('gulp-util');
var tmp = require('tmp');
var mkdirp = require('mkdirp');

var checkfile = require('./checkfile');
var logger = console.log.bind(console);
var app = koa();
var router = koarouter();

// markdown的语法高亮
marked.setOptions({
    highlight: function(code) {
        return hljs.highlightAuto(code).value;
    }
});

function copyNodeModulesStyles() {
    var styles = [
        'highlight.js/styles/github.css',
        'primer-markdown/build/build.css',
    ]
    var resolvedStyles = styles.map(require.resolve);

    var tmpStyleDir = tmp.dirSync();

    styles.forEach((f, idx) => {
        var src = resolvedStyles[idx];
        var dst = path.join(tmpStyleDir.name, path.dirname(f));
        mkdirp.sync(dst);

        fs.createReadStream(src).pipe(fs.createWriteStream(path.join(dst, path.basename(f))));
    });

    return tmpStyleDir.name;
}

var projectPath = process.cwd();
var paths = {
    nodeModules: copyNodeModulesStyles(),
    manualPath: path.resolve(__dirname, '../manual'), //  服务端资源
    assetsPath: path.resolve(__dirname, '../assets'),   // 服务端静态资源
    tmp: path.resolve(__dirname, '../.tmp'),    // 服务端开发文件
    projectPath: projectPath   //  开发项目路径
};
var layout = fs.readFileSync(paths.manualPath + '/layout.html');

var files = fs.readdirSync(paths.projectPath + '/examples');
var navList = files
    .filter(function(filename) {
        return /.js$/.test(filename);
    })
    .map(function(filename) {
        return '/examples/' + filename.split('.')[0];
    });
navList.unshift('/readme');

var exportEX = function *(next) {
    var example = this.params.example;
    gutil.log(gutil.colors.blue('-------> GET: example', example, '\n'));

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
        code: hljs.highlightAuto(codes.join('')).value
    };

    this.body =  _.template(layout)(data);
};

// router: readme
router.get('/readme', function *(next) {
    gutil.log(gutil.colors.blue('-------> GET: readme\n'));

    var readmePath = checkfile('README.md');
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
router.get('/examples/:example/*', exportEX);
router.get('/examples/:example', exportEX);

// redirect
router.redirect('/', '/readme');

// 静态资源
app.use(koastatic(paths.assetsPath));
app.use(koastatic(paths.nodeModules));
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
gutil.log(gutil.colors.blue('------->   Server started on ', port));
logger('<--------------------------------------------------\n');

// 启动浏览器
open('http://localhost:' + port);

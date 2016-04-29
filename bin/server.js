#!/usr/bin/env node
var  _            = require('lodash');
var  fs           = require('fs');
var  path         = require('path');
var  React        = require('react');
var  koa          = require('koa');
var  koarouter    = require('koa-router');
var  koastatic    = require('koa-static');
var  highlight    = require('highlight').Highlight;
var  marked       = require('marked');

var app = koa(),
    router = koarouter();

var cwd = process.cwd();

var __root = function (dir) { return path.join(cwd, dir); };
var asssetsPath = path.resolve(__dirname, '../assets');
var layout = fs.readFileSync(asssetsPath + '/layout.html');
var examplesPath = path.resolve(cwd, './examples');

var hasExamples = true;

try {
    console.log(examplesPath);
    fs.accessSync(examplesPath);
} catch(ex) {
    hasExamples = false;
}

if (!hasExamples) {
    console.log('未找到examples路径, 请使用zent-kit init初始化');
    return;
}

var files = fs.readdirSync('examples'),
    jsReg = new RegExp('.js$'),
    navList = files.filter(function (filename) {
        return jsReg.test(filename);
    }).map(function (filename) {
        return `/examples/${filename.split('.')[0]}`;
    });
navList.unshift('/readme');

//readme
var readmePath = path.resolve(cwd, '/readme.md');
router.get('/readme', function *(next) {
  var readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';
  var data = {
        navList: navList,
        script: false,
        readme: marked(readme),
        code: false
      };
  this.body = _.template(layout)(data);
});

//examples
router.get('/examples/:example', function *(next) {
  var example = this.params.example;
  var filePath = `${process.cwd()}/examples/${example}.js`;
  var readme = fs.readFileSync(filePath, 'utf8');
  var comments = [];
  var codes = [];

  readme.split('*/').forEach(function(item) {
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

//redirect
router.redirect('/', '/readme');

//process static file service
app.use(koastatic(asssetsPath));
app.use(koastatic(__root('build')));
app.use(koastatic(__root('src')));

app.use(router.routes());

var configPath = path.resolve(cwd, './package.json');
var config = {};

if (fs.existsSync(configPath)) {
    config = require(configPath);
}

var port = (config.zentServer && config.zentServer.port) || 7777;
app.listen(port);
console.log('Server started on ' + port);

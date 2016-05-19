#!/usr/bin/env node
var ch = require('child_process');
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var _ = require('lodash');

var logger = console.log.bind(console);
var projectPath = process.cwd();
var exec = ch.exec;

module.exports = function(name) {

    // 项目规范文件拷贝
    gulp.task('copy', function(callback) {
        logger('----> 开始初始化')

        exec('git clone git@gitlab.qima-inc.com:zent/zent-seed.git ' + name, function(err, stdout, stderr) {
            logger('-------> 拉取 zent-seed');
            exec('rm -rf ./'+ name + '/.git', function(err, stdout, stderr) {
                callback();
            });
        });
    });

    // 单独再导入readme
    gulp.task('init:readme', function(callback) {
        logger('-------> 生成 readme');

        var documentation = fs.readFileSync(path.resolve(__dirname, '../readme.md'));
        var fileName = path.resolve(projectPath, './' + name + '/readme.md');
        var file = _.template(fs.readFileSync(fileName))({
            name: name,
            documentation: documentation
        });
        fs.writeFile(fileName, file);

        callback();
    });

    // 单独再导入package.sjon
    gulp.task('init:package', function(callback) {
        logger('-------> 生成 package.json');

        var fileName = path.resolve(projectPath, './' + name + '/package.json');
        var file = _.template(fs.readFileSync(fileName))({
            name: name
        });
        fs.writeFile(fileName, file);

        callback();
    });

    // 项目依赖安装
    gulp.task('install', function(callback) {
        logger('-------> 安装 依赖....')

        var dependencies = ['react', 'eslint', 'eslint-config-airbnb', 'eslint-plugin-jsx-a11y', 'eslint-plugin-react'];
        exec('which npm', function(err, stdout, stderr) {
            var Npath = stdout.toString().trim();
            var command = Npath + ' i --registry="http://registry.npm.qima-inc.com" ' + dependencies.join(' ');
            exec(command, {cwd: projectPath + '/' + name}, function(err, stdout, stderr) {
                logger(stdout + '');
                logger('----> 初始化完成！')
                callback();
            });
        });
    });

    runSequence('copy', 'init:readme', 'init:package', 'install');
}

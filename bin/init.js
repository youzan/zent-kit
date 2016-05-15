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
    gulp.task('copy', function() {
        logger('----> 开始初始化')

        return gulp.src(path.resolve(__dirname, '../scaffold/**/*'), { dot: true })
            .pipe(gulp.dest(path.resolve(projectPath, './' + name)));
    });

    // 修改项目名
    gulp.task('init:name', function() {
        logger('----> 重命名');

        var fileName = path.resolve(projectPath, './' + name + '/package.json');
        var file = _.template(fs.readFileSync(fileName))({
            name: name
        });
        fs.writeFile(fileName, file);
    });

    // 项目依赖安装
    gulp.task('install', function() {
        logger('----> 安装依赖....')

        var dependencies = ['react', 'eslint', 'eslint-config-airbnb', 'eslint-plugin-jsx-a11y', 'eslint-plugin-react'];
        exec('which npm', function(err, stdout, stderr) {
            var Npath = stdout.toString().trim();
            var command = Npath + ' i --registry="http://registry.npm.qima-inc.com" ' + dependencies.join(' ');
            console.log(command);
            exec(command, {cwd: projectPath + '/' + name}, function(err, stdout, stderr) {
                logger(stdout + '');
                logger('----> 初始化完成！')
            });
        });
    });

    runSequence('copy', 'init:name', 'install');
}

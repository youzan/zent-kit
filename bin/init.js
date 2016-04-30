#!/usr/bin/env node
var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var ch = require('child_process');

var logger = console.log.bind(console);
var projectPath = process.cwd();

module.exports = function(name) {

    // 项目规范文件拷贝
    gulp.task('copy', function () {
        logger('----> 开始初始化')

        return gulp.src(path.resolve(__dirname, '../scaffold/**/*'))
            .pipe(gulp.dest(path.resolve(projectPath, './' + name)));
    });

    // 项目依赖安装
    gulp.task('install', function() {
        logger('----> 安装依赖....')

        var dependencies = ['react'];
        ch.exec('which npm', function(err, stdout, stderr) {
            var Npath = stdout.toString().trim();
            var command = Npath + ' i ' + dependencies.join(' ') + ' --registry="http://registry.npm.qima-inc.com"';
            ch.exec(command, {cwd: projectPath + '/' + name}, function(err, stdout, stderr) {
                logger(stdout + '');
                logger('----> 初始化完成！')
            });
        });
    });

    runSequence('copy', 'install');
}

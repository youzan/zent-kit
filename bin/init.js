#!/usr/bin/env node
var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var ch = require('child_process');

var cwd = process.cwd();

module.exports = function(name) {

    // 假设还没同名的文件夹
    gulp.task('copy', function () {
        return gulp.src(path.resolve(__dirname, '../scaffold/**/*'))
            .pipe(gulp.dest(path.resolve(cwd, './' + name)));
    });

    gulp.task('install', function() {
        var dependencies = ['react'];
        console.log('安装依赖')
        ch.exec('which npm', function(err, stdout, stderr) {
            var path = stdout.toString().trim();
            var command = path + ' i ' + dependencies.join(' ') + ' --registry="http://registry.npm.qima-inc.com"';
            ch.exec(command, {cwd: cwd + '/' + name}, function(err, stdout, stderr) {
                console.log(stdout + '');
            });
        });
    });

    runSequence('copy', 'install');
}

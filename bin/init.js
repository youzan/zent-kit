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
        var dependencies = ['babel-core', 'babel-loader', 'sass-loader', 'css-loader', 'less-loader'];
        var basePath = path.resolve(__dirname, '../node_modules');
        var modules = dependencies.map(function(item) {
            return (basePath + '/' + item);
        })
        console.log(modules);
        console.log(path.resolve(cwd, './' + name + 'node_modules'));
        return gulp.src(modules)
            .pipe(gulp.dest(path.resolve(cwd, './' + name + '/node_modules')))
            .on('end', function () {
                console.log('初始化成功!');
            });
    });

    runSequence('copy');
}

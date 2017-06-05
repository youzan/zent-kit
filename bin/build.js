#!/usr/bin/env node

/* eslint-disable no-inline-comments */

var path = require('path');
var webpack = require('webpack');
var gulp = require('gulp');
var symlink = require('gulp-sym');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var clean = require('gulp-clean');

var projectPath = process.cwd(); // 执行命令所在目录

var paths = {
    webpack: path.resolve(__dirname, '../webpack/webpack.build.js'),   // webpack
    index: path.resolve(__dirname, '../manual/index.jsx'),  // index源文件
    assets: path.resolve(projectPath, './assets'),  // 需要监听的examples文件
    examples: path.resolve(projectPath, './examples')  // 需要监听的examples文件
};

module.exports = function(buildDir) {
    var webpackConfig = require(paths.webpack)(
        path.join(buildDir, 'index.jsx'),
        path.join(buildDir, 'build')
    );

    gulp.task('index', function() {
        return gulp.src(paths.index)
            .pipe(gulp.dest(buildDir));
    });

    gulp.task('clean', function() {
        gutil.log('------->   Clean  old examples');

        return gulp.src([buildDir + '/*', '!' + buildDir + '/node_modules'], {read: false})
            .pipe(clean({force: true}));
    });

    gulp.task('link:examples', function() {
        gutil.log('------->    Read  new examples');

        return gulp.src(paths.examples)
            .pipe(symlink(buildDir + '/examples', {force: true}));
    });

    gulp.task('link:assets', function() {
        gutil.log('------->    Read  new assets');

        return gulp.src(paths.assets)
            .pipe(symlink(buildDir + '/assets', {force: true}));
    });

    gulp.task('webpack', function(callback) {
        webpack(webpackConfig, function(err, stats) {
            gutil.log('[webpack]', stats.toString({}));
        });
    });

    runSequence('clean', ['index', 'link:examples'], 'webpack');
};

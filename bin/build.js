#!/usr/bin/env node
var path = require('path');
var webpack = require('webpack');
var named = require('vinyl-named');
var gulp = require('gulp');
var symlink = require('gulp-sym');
var runSequence = require('run-sequence');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var gutil = require('gulp-util');

var cwd = process.cwd();    // 执行命令所在目录

var paths = {
  index: path.resolve(__dirname, '../index.jsx'),  // index源文件
  assets: path.resolve(cwd, './assets'), // assets
  tmp: path.join(__dirname, '../.tmp'),    // index拷贝目录
  examples: path.join(cwd, '/examples'),  // 需要监听的examples文件
  scriptDest: path.resolve(cwd, './build/')  // 开发编译文件
};

gulp.task('index', function() {
    return gulp.src(paths.index)
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('assets', function() {
    return gulp.src(paths.assets)
        .pipe(symlink(paths.tmp + '/assets', {force: true}));
})

gulp.task('examples', function() {
    return gulp.src(paths.examples)
        .pipe(symlink(paths.tmp + '/examples', {force: true}));
});

var webpackConfig = require(path.resolve(__dirname, '../webpack.conf.js'))(path.join(paths.tmp, 'index.jsx'), paths.scriptDest);
gulp.task('webpack', function(callback) {
    webpack(webpackConfig, function(err, stats) {
        gutil.log('[webpack]', stats.toString({}));
    })
});

runSequence(['index', 'assets', 'examples'], 'webpack');

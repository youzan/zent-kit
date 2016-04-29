#!/usr/bin/env node
var path = require('path');
var webpack = require('webpack');
var named = require('vinyl-named');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var gutil = require('gulp-util');

var cwd = process.cwd();    // 执行命令所在目录

var paths = {
  index: path.resolve(cwd, './src/index.jsx'),  // index源文件
  assets: path.resolve(cwd, './assets/**/*'), // assets
  tmp: path.join(__dirname, '../.tmp'),    // index拷贝目录
  script: path.join(cwd, '/examples/**/*.js'),  // 需要监听的examples文件
  scriptDest: path.resolve(cwd, './build/')  // 开发编译文件
};

gulp.task('initCopy', function() {
    gutil.log('[copy]');
    runSequence('index', 'assets', 'examples');
});

gulp.task('index', function() {
    return gulp.src(paths.index)
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('assets', function() {
    return gulp.src(paths.assets)
        .pipe(gulp.dest(paths.tmp + '/assets'));
})

gulp.task('examples', function() {
    return gulp.src(paths.script)
        .pipe(gulp.dest(paths.tmp + '/examples'));
});

var webpackConfig = require(path.resolve(__dirname, '../webpack.conf.js'))(path.join(paths.tmp, 'index.jsx'), paths.scriptDest);
gulp.task('webpack', function(callback) {
    webpack(webpackConfig, function(err, stats) {
        gutil.log('[webpack]', stats.toString({}));
        //callback();
    })
});

runSequence(['initCopy', 'webpack']);

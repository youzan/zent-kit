#!/usr/bin/env node
var path = require('path');
var webpack = require('webpack');
var named = require('vinyl-named');
var gulp = require('gulp');
var symlink = require('gulp-sym');
var runSequence = require('run-sequence');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var logger = console.log.bind(console);

var projectPath = process.cwd();    // 执行命令所在目录

var paths = {
  webpack: path.resolve(__dirname, '../webpack/webpack.build.js'),   // webpack
  index: path.resolve(__dirname, '../manuel/index.jsx'),  // index源文件
  tmp: path.resolve(__dirname, '../.tmp'),    // 拷贝临时目录
  assets: path.resolve(projectPath, './assets'),  // 需要监听的examples文件
  examples: path.resolve(projectPath, './examples')  // 需要监听的examples文件
};

var webpackConfig = require(paths.webpack)(path.join(paths.tmp, 'index.jsx'), path.join(paths.tmp, 'build'));

module.exports = function() {

    gulp.task('index', function() {
        return gulp.src(paths.index)
            .pipe(gulp.dest(paths.tmp));
    });

    gulp.task('clean', function() {
        gutil.log('------->   Clean  old examples');

        return gulp.src(paths.tmp + '/*', {read: false})
            .pipe(clean({force: true}));
    });

    gulp.task('link:examples', function() {
        gutil.log('------->    Read  new examples');

        return gulp.src(paths.examples)
            .pipe(symlink(paths.tmp + '/examples', {force: true}));
    });

    gulp.task('link:assets', function() {
        gutil.log('------->    Read  new assets');

        return gulp.src(paths.assets)
            .pipe(symlink(paths.tmp + '/assets', {force: true}));
		
		// console.log(paths.assets);
		// console.log(paths.tmp + '/assets');
    });

    gulp.task('webpack', function(callback) {
        webpack(webpackConfig, function(err, stats) {
            gutil.log('[webpack]', stats.toString({}));
        })
    });

    runSequence('clean', ['index', 'link:examples'], 'webpack');
};

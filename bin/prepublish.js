var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var fs = require('fs');
var clean = require('gulp-clean');
var _ = require('lodash');
var postcss = require('gulp-postcss');
var scss = require('postcss-scss');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var webpack = require('webpack');
var gutil = require('gulp-util');

var checkfile = require('./checkfile');
var logger = console.log.bind(console);

var projectPath = process.cwd();
var config = require(`${projectPath}/package.json`);
var paths = {
        projectPath: projectPath,
        src: path.join(projectPath, '/src'),
        lib: path.join(projectPath, '/lib/'),
        dist: path.join(projectPath, '/dist/'),
        index: path.join(projectPath, '/src/Index'),
        webpack: path.resolve(__dirname, '../webpack.prepublish.js'),   // webpack
        readmeSrc: path.join(__dirname, '../manuel/readme.md')    // 项目readme的源文件
    };

// 读取src下文件
function getContent(path) {
    var fileList = [];
    var files = fs.readdirSync(path);
    files.forEach(function(item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
            fileList.concat(getContent(path + '/' + item));
        } else {
            /(.js|.jsx|.es6)$/.test(item) && fileList.push(fs.readFileSync(path + '/' + item, 'utf8'));
        }
    })
    return fileList;
}

// 筛选src文件的注释
function getComment(list) {
    var result = [];
    list.forEach(function(item) {
        var tmp = item.match(/\/\*(.|\s)+?\*\//g);
        if (tmp) {
            result = result.concat(tmp.map(function(value) {
                return value.slice(2, -2);
            }))
        }
    });

    return result.join('');
}

// 旧文件 删除
gulp.task('clean', function() {
    logger('------->   Clean  lib');

    return gulp.src([paths.lib + '*'], {read: false})
        .pipe(clean({force: true}));
});

// readme 制作
gulp.task('prepare:md', function() {
    logger('-------> Prepare  README');

    var files = getContent(paths.src);
    var comments = getComment(files);
    var readme = _.template(fs.readFileSync(paths.readmeSrc))(Object.assign({
            comments: comments
        }, config));

    fs.writeFile(path.join(paths.projectPath, '/readme.md'), readme);
});

gulp.task('prepare:js', ['webpack'], function() {
    logger('-------> Prepare  JS');
    
    gulp.src(path.join(paths.dist, '/**/*.js'))
        .pipe(rename({
            extname: '.jsx'
        }))
        .pipe(gulp.dest(paths.dist));
});

// js 转码
gulp.task('babel', function() {
    return gulp.src([path.join(paths.src, '/**/*.jsx'), path.join(paths.src, '/**/*.js')])
        .pipe(babel({stage:0}))
        .pipe(gulp.dest(paths.lib));
});

// css 转码
gulp.task('prepare:css', function () {
    logger('-------> Prepare  CSS');

    var name = config.zent && config.zent.sass ? config.zent.sass : 'index'
    var cssPath = checkfile('assets/' + name + '.scss');
    if(cssPath) {
        var processors = [precss, autoprefixer];
        gulp.src(cssPath)
            .pipe(postcss(processors, {syntax: scss}))
            .pipe(gulp.dest(paths.lib));
    }
});

var webpackConfig = require(paths.webpack)(paths.index, paths.dist);
gulp.task('webpack', ['babel'], function(callback) {
    webpack(webpackConfig, function(err, stats) {
        gutil.log('[webpack]', stats.toString({}));
        callback();
    });
});

runSequence(['clean', 'prepare:md', 'prepare:css', 'prepare:js']);

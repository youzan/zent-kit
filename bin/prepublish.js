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

var switchUMD = require('./switchUMD');

var projectPath = process.cwd();
var config = require(`${projectPath}/package.json`);
var paths = {
        projectPath: projectPath,
        src: path.join(projectPath, '/src'),
        lib: path.join(projectPath, '/lib/'),
        dist: path.join(projectPath, '/dist/'),
        index: path.join(projectPath, '/src/Index'),
        webpack: path.resolve(__dirname, '../webpack/webpack.prepublish.js'),   // webpack
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
                if (value.match(/^\/\*\*/g)) {
                    return value.slice(3, -2);
                } else {
                    return value.slice(2, -2);
                }
            }))
        }
    });

    return result.join('');
}

var webpackConfig = require(paths.webpack)(paths.index, paths.dist);

module.exports = function() {
    // 旧文件 删除
    gulp.task('clean', function() {
        gutil.log('------->   Clean  lib & dist');

        return gulp.src([paths.lib + '*', paths.dist + '*'], {read: false})
            .pipe(clean({force: true}));
    });

    // readme 制作
    gulp.task('prepare:md', function() {
        gutil.log('-------> Prepare  README');

        var files = getContent(paths.src);
        var comments = getComment(files);
        var readme = _.template(fs.readFileSync(paths.readmeSrc))(Object.assign({
                comments: comments
            }, config));

        fs.writeFile(path.join(paths.projectPath, '/readme.md'), readme);
    });

    //
    gulp.task('prepare:js', ['webpack'], function() {
        gutil.log('-------> Prepare  JS');

        var list = fs.readdirSync(paths.dist);

        for (var i = 0, len = list.length; i < len; i++) {
            if (/\.js?$/.test(list[i])) {
                logger('修改umd头=======>\t' + list[i]);
                switchUMD(paths.dist + list[i]);
            }
        }
    });

    // js 转码
    gulp.task('babel', function() {
        // 此处有一个瑕疵，这几个 presets  既安装在 zent-kit 这边，又在组件那边安装了，重复
        return gulp.src([path.join(paths.src, '/**/*.jsx'), path.join(paths.src, '/**/*.js')])
            .pipe(babel({
                'presets': ['es2015', 'react', 'stage-0']
            }))
            .pipe(gulp.dest(paths.lib));
    });

    // css 转码
    gulp.task('prepare:css', function () {
        gutil.log('-------> Prepare  CSS');

        var name = config.zent && config.zent.sass ? config.zent.sass : 'index'
        var cssPath = checkfile('assets/' + name + '.scss');
        if(cssPath) {
            var processors = [precss, autoprefixer];
            gulp.src(cssPath)
                .pipe(postcss(processors, {syntax: scss}))
                .pipe(rename(function(path) {
                    path.extname = ".css"
                }))
                .pipe(gulp.dest(paths.lib));
        }
    });

    gulp.task('webpack', ['babel'], function(callback) {
        webpack(webpackConfig, function(err, stats) {
            // install、publish都会触发prepublish操作，这里在prepublish不打印明细
            // gutil.log('[webpack]', stats.toString({}));
            callback();
        });
    });

    runSequence(['clean', 'prepare:css', 'prepare:js']);
}

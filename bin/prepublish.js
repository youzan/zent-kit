var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');
var fs = require('fs');
var clean = require('gulp-clean');
var _ = require('lodash');
var postcss = require('gulp-postcss');
var scss = require('postcss-scss');
var autoprefixer = require('autoprefixer');
var precss = require('precss');

var checkfile = require('./checkfile');
var logger = console.log.bind(console);

var projectPath = process.cwd();
var config = require(`${projectPath}/package.json`);
var paths = {
        projectPath: projectPath,
        src: path.join(projectPath, '/src'),
        dest: path.join(projectPath, '/lib/'),
        readmeSrc: path.join(__dirname, '../manuel/readme.md'),    // 项目readme的源文件
    };

// 读取src下文件
function getContent(path) {
    var fileList = [];
    var files = fs.readdirSync(path);
    files.forEach(function(item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
            fileList.concat(getContent(path + '/' + item));
        } else {
            /(.js|.jsx|.es6)$/.test(item) && fs.accessSync(path + '/' + item) && fileList.push(fs.readFileSync(path + '/' + item, 'utf8'));
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

    return gulp.src(paths.dest + '*', {read: false})
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

// js 转码
gulp.task('prepare:js', function() {
    logger('-------> Prepare  JS');

    gulp.src([path.join(paths.src, '/**/*.jsx'), path.join(paths.src, '/**/*.js')])
        .pipe(babel({stage:0}))
        .pipe(gulp.dest(paths.dest));
})

// css 转码
gulp.task('prepare:css', function () {
    logger('-------> Prepare  CSS');

    var name = config.zent && config.zent.sass ? config.zent.sass : 'index'
    var cssPath = checkfile('assets/' + name + '.scss');
    if(cssPath) {
        var processors = [precss, autoprefixer];
        gulp.src(cssPath)
            .pipe(postcss(processors, {syntax: scss}))
            .pipe(gulp.dest(paths.dest));
    }
});

runSequence(['clean', 'prepare:md', 'prepare:css', 'prepare:js']);

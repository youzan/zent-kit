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
var webpack = require('webpack');
var gutil = require('gulp-util');

var base64 = require('./postcss-base64');
var checkfile = require('./checkfile');
var logger = console.log.bind(console);

var switchUMD = require('./switchUMD');

var postcssPlugin = require('../webpack/postcss.conf');

var babelPackages = require('../webpack/babelPackages');

var projectPath = process.cwd();
var config = require(projectPath + '/package.json');
var paths = {
    projectPath: projectPath,
    src: path.join(projectPath, '/src'),
    lib: path.join(projectPath, '/lib/'),
    css: path.join(projectPath, '/css/'),
    dist: path.join(projectPath, '/dist/'),
    index: path.join(projectPath, '/src/index'),

    // webpack
    webpack: path.resolve(__dirname, '../webpack/webpack.prepublish.js'),

    // 项目readme的源文件
    readmeSrc: path.join(__dirname, '../manual/README.md')
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
    });
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
            }));
        }
    });

    return result.join('');
}

function runPostcss(src, out, base64Root) {
    gulp.src(src)
        .pipe(postcss(postcssPlugin.slice().concat(base64({
            root: base64Root,
            extensions: ['.png', '.jpg'],
            exclude: /^https?:\/\/.+$/i
        })), {parser: scss}))
        .pipe(rename(function(path) {
            path.extname = '.css';
        }))
        .pipe(gulp.dest(out));
}

var webpackConfig = require(paths.webpack)(paths.index, paths.dist);

module.exports = function(options) {
    options = options || {};

    // 旧文件 删除
    gulp.task('clean', function() {
        gutil.log('Clean  lib, css and dist');

        return gulp.src([paths.lib + '*', paths.dist + '*', paths.css + '*'], {read: false})
            .pipe(clean({force: true}));
    });

    // readme 制作
    gulp.task('prepare:md', function() {
        gutil.log('Prepare  README');

        var files = getContent(paths.src);
        var comments = getComment(files);
        var readme = _.template(fs.readFileSync(paths.readmeSrc))(
          Object.assign({
              comments: comments
          }, config)
        );

        fs.writeFile(path.join(paths.projectPath, '/README.md'), readme);
    });

    //
    gulp.task('prepare:js', ['webpack'], function() {
        gutil.log('Prepare  JS');

        var list = fs.readdirSync(paths.dist);

        for (var i = 0, len = list.length; i < len; i++) {
            if (/\.js?$/.test(list[i])) {
                logger('修改umd头\t' + list[i]);
                switchUMD(paths.dist + list[i]);
            }
        }
    });

    // js 转码
    gulp.task('babel', function() {
        var plugins = babelPackages.prepublish.plugins;
        if (options.umd) {
            plugins = plugins.concat('babel-plugin-transform-es2015-modules-umd');
        }

        return gulp.src([path.join(paths.src, '/**/*.jsx'), path.join(paths.src, '/**/*.js')])
            .pipe(babel({
                presets: babelPackages.prepublish.presets.map(require.resolve),
                plugins: plugins.map(require.resolve)
            }))
            .pipe(gulp.dest(paths.lib));
    });

    // css 转码
    gulp.task('prepare:css', function() {
        gutil.log('Prepare  CSS');

        var name = config.zent && config.zent.sass ? config.zent.sass : 'index';
        var cssPath = checkfile('assets/' + name + '.scss');
        // var base64Root = path.resolve(cssPath, '..');
        var base64Root = path.resolve('.');
        if (cssPath) {
            runPostcss(cssPath, paths.lib, base64Root);
        }

        // 对整个 assets 目录下的 scss 转码
        if (options.transpileCSS) {
            gutil.log('Transpile CSS');

            runPostcss(
                ['assets/**/*.scss', '!assets/**/_*.scss'],
                paths.css,
                base64Root
            );
        }

    });

    gulp.task('webpack', ['babel'], function(callback) {
        webpack(webpackConfig, function(err, stats) {
            // install、publish都会触发prepublish操作，这里在prepublish不打印明细
            // gutil.log('[webpack]', stats.toString({}));
            callback();
        });
    });

    runSequence('clean', ['prepare:css', 'prepare:js']);
};

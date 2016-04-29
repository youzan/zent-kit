var path = require('path');
var gulp = require('gulp');
var babel = require('gulp-babel');
var less = require('gulp-less');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var fs = require('fs');
var runSequence = require('run-sequence');
var template = require('gulp-template');
var gutil = require('gulp-util');

var cwd = process.cwd();
var config = require(`${process.cwd()}/package.json`);
var cssName = config.name.split('/')[1] ? config.name.split('/')[1] : 'index'
var paths = {
        script: [path.join(cwd, '/src/**/*.jsx'), path.join(cwd, '/src/**/*.js')],
        scriptDir: path.join(cwd, '/src'),
        dest: path.join(cwd, '/lib/'),
        css: [path.join(cwd, 'assets', 'index')],
        readmeSrc: path.join(__dirname, '../src/readme.md'),    // 所有目录的src将会在此
        readmeDest: path.join(cwd)
    };

gulp.task('clean', function() {
  gutil.log('clean lib');
  return gulp.src(paths.dest + '*', {read: false})
    .pipe(clean({force: true}));
})

var fileList = [];
function getContent(path) {
    var files = fs.readdirSync(path);
    files.forEach(function(item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
            getContent(path + '/' + item);
        } else {
            /(.js|.jsx|.es6)$/.test(item) && fs.existsSync(path + '/' + item) && fileList.push(fs.readFileSync(path + '/' + item, 'utf8'));
        }
    })
}

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

gulp.task('prepare-md', function() {
  gutil.log('prepare readme');
  getContent(paths.scriptDir);
  var comments = getComment(fileList);

    gulp.src(paths.readmeSrc)
        .pipe(template(Object.assign({
            comments: comments
        }, config)))
        .pipe(gulp.dest(paths.readmeDest));
});

gulp.task('prepare-js', function() {
  gutil.log('prepare js files');
  gulp.src(paths.script)
    .pipe(babel({stage:0}))
    .pipe(gulp.dest(paths.dest));
})

gulp.task('prepare-css', function () {
  gutil.log('prepare css files');
    if(fs.existsSync(paths.css + '.scss')) {
      gulp.src(paths.css + '.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.dest));
    }
    if(fs.existsSync(paths.css + '.less')) {
      gulp.src(paths.css + '.less')
        .pipe(less())
        .pipe(gulp.dest(paths.dest));
    }
});

runSequence(['clean', 'prepare-md', 'prepare-js', 'prepare-css']);

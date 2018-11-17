const gulp = require('gulp');
const jshint = require('gulp-jshint');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const autoprefix = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const print = require('gulp-filesinstream');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const img64Html = require('gulp-imgbase64');
const img64Css = require('gulp-css-base64'); // css inline base64

const reload = browserSync.reload;

const compressConfig = {
    basePath: './src',
    distPath: './dist/',
    cssPath: './src/css/*.css',
    lessPath: './src/less/*.less',
    jsPath: './src/js/*.js',
    imgPath: './src/img/*.*',
    htmlPath: './src/*.html',
    distCssPath: './dist/css/*.css',
    distLessPath: './dist/less/*.less',
    distJsPath: './dist/js/*.js',
    distImgPath: './dist/img/*.*',
    distHtmlPath: './dist/*.html',
};
const allFilePath = [compressConfig.basePath, compressConfig.jsPath, compressConfig.cssPath, compressConfig.imgPath, compressConfig.lessPath]
const autoprefixConfig = {
    browsers: ['last 2 versions']
};

gulp.task('jshint', () => {
    return gulp.src(compressConfig.jsPath)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('compressJs', () => {
    return gulp.src(compressConfig.jsPath)
        .pipe(print())
        .pipe(babel())
        .pipe(uglify())
        // .pipe(rename(function (path) {
        //     path.extname += '?V='+Date.now();
        //   }))
        .pipe(gulp.dest('./dist/js'))
});


gulp.task('less', () => {
    // 其余的样式文件都由style.less引入
    return gulp.src([compressConfig.cssPath, compressConfig.lessPath])
        .pipe(less())
        .pipe(autoprefix(autoprefixConfig))
        .pipe(img64Css())
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(rename((path) => {
            path.basename += '.min';
        }));
});

gulp.task('minify', () => {
    return gulp.src(compressConfig.htmlPath)
        .pipe(img64Html())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('imageMin', ()=>{
    return gulp.src(compressConfig.imgPath)
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
})

gulp.task('build', gulp.parallel('compressJs', 'less', 'minify', 'imageMin'));

gulp.task('browserSync', gulp.series('build', () => {
    browserSync({
        server: {
            baseDir: compressConfig.distPath
        }
    })
    gulp.watch(compressConfig.jsPath, gulp.series('compressJs')).on('change', reload);
    gulp.watch([compressConfig.cssPath, compressConfig.lessPath], gulp.series('imageMin','less')).on('change', reload);
    gulp.watch(compressConfig.htmlPath, gulp.series('imageMin','minify')).on('change', reload);
}));
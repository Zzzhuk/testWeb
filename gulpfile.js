'use strict';

var gulp = require('gulp'),
sass = require('gulp-sass'),
rigger = require('gulp-rigger'),
watch = require('gulp-watch'),
notify = require("gulp-notify"),
browserSync = require('browser-sync').create();
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/css/*.scss',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
     watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.scss',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
};
function html() {
	gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger())
        .pipe(browserSync.stream()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build
}
function scss() {
	gulp.src(path.src.style)
        .pipe(sass().on( 'error', notify.onError(
          {
            message: "<%= error.message %>",
            title  : "Sass Error!"
          } ) ))
        .pipe(browserSync.stream()) //Скомпилируем
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.css));
}
function css() {
	gulp.src(path.src.css)
        .pipe(browserSync.stream()) //Скомпилируем
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.css));
}
function img() {
	gulp.src(path.src.img) //Выберем наши картинки
        .pipe(gulp.dest(path.build.img));
}
function fnt() {
	gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
}
function js() {
	gulp.src(path.src.js)
    .pipe(browserSync.stream())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .on( 'error', notify.onError(
          {
            message: "<%= error.message %>",
            title  : "Sass Error!"
          } ) );
}

gulp.task('default', function(){
	browserSync.init({
        server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
    });
    watch([path.watch.html], function(event, cb) {
        html();
    }).on('change', browserSync.reload);
    watch([path.watch.style], function(event, cb) {
        scss();
    }).on('change', browserSync.reload);
    watch([path.watch.css], function(event, cb) {
        css();
    }).on('change', browserSync.reload);
    watch([path.watch.js], function(event, cb) {
        js();
    }).on('change', browserSync.reload);
    watch([path.watch.img], function(event, cb) {
        img();
    });
    watch([path.watch.fonts], function(event, cb) {
        fnt();
    });
});
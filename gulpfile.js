'use strict';

const gulp = require('gulp'),
sass = require('gulp-sass'),
rigger = require('gulp-rigger'),
watch = require('gulp-watch'),
notify = require("gulp-notify"),
browserSync = require('browser-sync').create(),
image = require('gulp-image'),
htmlmin = require('gulp-htmlmin'),
cleanCSS = require('gulp-clean-css'),
minify = require('gulp-minify');
var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/*.scss',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
     watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.scss',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
};
function html() {
	gulp.src(path.src.html) 
        .pipe(rigger())
        .pipe(browserSync.stream())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(path.build.html));
}
function scss() {
	gulp.src(path.src.style)
        .pipe(sass().on( 'error', notify.onError(
          {
            message: "<%= error.message %>",
            title  : "Sass Error!"
          } ) ))
        .pipe(browserSync.stream()) 
        .pipe(rigger()) 
        .pipe(cleanCSS()) 
        .pipe(gulp.dest(path.build.css));
}
function css() {
	gulp.src(path.src.css)
        .pipe(browserSync.stream())
        .pipe(rigger()) 
        .pipe(cleanCSS()) 
        .pipe(gulp.dest(path.build.css));
}
function img() {
	gulp.src(path.src.img)
        .pipe(image())
        .pipe(browserSync.stream())
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
        .pipe(minify())
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
gulp.task('prod', function(){
    html();scss();css();js();img();fnt();
});
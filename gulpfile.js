'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var browserify = require('browserify');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var requirejsOptimize = require('gulp-requirejs-optimize');

var DIST_DIR = 'docs/';
var SRC_DIR = 'src/';

// BrowserSync Static Server
gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: {
      baseDir: DIST_DIR
    }
  });

  gulp.watch(SRC_DIR + 'scss/**/*.scss', ['sass']);
  // gulp.watch(SRC_DIR + 'js/*.js', ['browserify']);
  gulp.watch(SRC_DIR + 'js/**/*.js', ['copy-scripts']);
  gulp.watch(DIST_DIR + '*.html').on('change', browserSync.reload);
});

/**
 * CSS
 */
gulp.task('sass', function() {
  return gulp.src(SRC_DIR + 'scss/main.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(DIST_DIR + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('minify-css', function() {
  return gulp.src(DIST_DIR + 'css/styles.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(DIST_DIR + 'css/'));
});

/**
 * Javascript
 */
gulp.task('browserify', function() {
  browserify(SRC_DIR + 'js/main.js')
    .bundle()
    .on('error', function(e) {
        gutil.log(e);
    })
    .pipe(source('scripts.js'))
    .pipe(gulp.dest(DIST_DIR + 'js/'))
    .pipe(browserSync.stream());
});

gulp.task('compress-js', function() {
  return gulp.src(DIST_DIR + 'js/scripts.js')
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest(DIST_DIR + 'js'));
});

gulp.task('copy-scripts', function() {
   gulp.src(SRC_DIR + 'js/**/**')
   .pipe(gulp.dest(DIST_DIR + 'js'))
   .pipe(browserSync.stream());
});

gulp.task('build-scripts', function () {
  return gulp.src('src/js/main.js')
  .pipe(requirejsOptimize({
    baseUrl: 'src/js',
  }))
  .pipe(gulp.dest(DIST_DIR + 'js'));
});

/**
 * DEPLOY TO GITHUB PAGES
 */
gulp.task('deploy', ['compress-js', 'minify-css'], function() {
  return gulp.src(DIST_DIR + '**/*')
    .pipe(ghPages());
});

gulp.task('default', ['serve']);
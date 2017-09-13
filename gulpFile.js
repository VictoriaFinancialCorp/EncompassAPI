// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// copy bootstrap
gulp.task('boostrap', function() {
    gulp.src('node_modules/bootstrap/dist/css/*.min.css')
      .pipe(gulp.dest('public/stylesheets'));

    gulp.src('node_modules/bootstrap/dist/js/*.min.js')
      .pipe(gulp.dest('public/javascripts'));

    gulp.src('node_modules/bootstrap/fonts/*')
      .pipe(gulp.dest('public/fonts'));

    gulp.src('node_modules/jquery/dist/jquery.min.js')
      .pipe(gulp.dest('public/javascripts'));
    return null;
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('public/javascripts/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('public/javascripts'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/javascripts'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    //gulp.watch('scss/*.scss', ['sass']);
});

// Default Task
// gulp.task('default', ['lint', 'boostrap', 'scripts']);
gulp.task('default', ['lint', 'boostrap']);

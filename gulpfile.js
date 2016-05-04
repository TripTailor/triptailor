var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var glob = require('glob');

gulp.task('build', function () {
  return browserify({entries: glob.sync('public/javascripts/react/*.js')})
  .transform(babelify, {presets: ['es2015', 'react']})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('public/javascripts/'));
});

gulp.task('watch', ['build'], function () {
  gulp.watch('public/javascripts/react/*.js', ['build']);
});

gulp.task('default', ['watch']);

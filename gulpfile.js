var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('header', function () {
  return transform('header.js');
});
gulp.task('index', function () {
  return transform('index.js');
});

gulp.task('watch', ['header', 'index'], function () {
  gulp.watch('public/javascripts/react/*.js', ['header', 'index']);
});



gulp.task('default', ['watch']);

var transform = function(entry) {
  return browserify({entries: 'public/javascripts/react/' + entry})
  .transform(babelify, {presets: ['es2015', 'react']})
  .bundle()
  .pipe(source('bundle-' + entry))
  .pipe(gulp.dest('public/javascripts/'));
};

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
  return transform('index.js');
});

gulp.task('watch', ['build'], function () {
  gulp.watch('public/javascripts/react/*.js', ['build']);
});

gulp.task('default', ['watch']);

var transform = function(entry) {
  return browserify({entries: 'public/javascripts/react/' + entry})
  .transform(babelify, {presets: ['es2015', 'react']})
  .bundle()
  .pipe(source('bundle-' + entry))
  .pipe(gulp.dest('public/javascripts/'));
};

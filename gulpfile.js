var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var $ = require('jquery');

var tasks = ['header', 'index', 'tags'];

tasks.forEach(function(task, i, arr) {
  gulp.task(task, function() {
    return transform(task + '.js');
  });
});

gulp.task('watch', tasks, function () {
  gulp.watch('public/javascripts/react/*.js', tasks);
});

gulp.task('default', ['watch']);


var transform = function(entry) {
  return browserify({entries: 'public/javascripts/react/' + entry})
  .transform(babelify, {presets: ['es2015', 'react']})
  .bundle()
  .on('error', function(e) {
    console.log(e.message);
    this.emit("end")
  })
  .pipe(source('bundle-' + entry))
  .pipe(gulp.dest('public/javascripts/'));
};

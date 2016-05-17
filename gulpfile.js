var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var $ = require('jquery');

var reactTasks = ['header', 'index', 'tags'];

reactTasks.forEach(function(task, i, arr) {
  gulp.task(task, function() {
    return transform(task + '.js');
  });
});

gulp.task('watch', reactTasks, function () {
  gulp.watch(['app/scripts/react/*.js','app/scripts/*.js'], reactTasks);
});

gulp.task('jquery-ui', function() {
  return gulp.src(['node_modules/jquery-ui/themes/redmond/*/*', "!node_modules/jquery-ui/themes/redmond/jquery-ui.css", "!node_modules/jquery-ui/themes/redmond/jquery.ui.theme.css"])
  .pipe(gulp.dest('public/stylesheets/jquery-ui/'));
});

gulp.task('default', ['watch', 'jquery-ui']);


var transform = function(entry) {
  return browserify({entries: 'app/scripts/react/' + entry})
  .transform(babelify, {presets: ['es2015', 'react']})
  .bundle()
  .on('error', function(e) {
    console.log(e.message);
    this.emit("end")
  })
  .pipe(source('bundle-' + entry))
  .pipe(gulp.dest('public/javascripts/'));
};

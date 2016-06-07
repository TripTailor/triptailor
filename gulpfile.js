var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var $ = require('jquery');

var reactTasks = ['header', 'about-us', 'footer', 'index', 'tags', 'results'];

reactTasks.forEach(function(task, i, arr) {
  gulp.task(task, function() {
    return transform(task + '.js');
  });
});

gulp.task('watch', reactTasks, function () {
  gulp.watch(['app/scripts/react/*.js','app/scripts/*.js'], reactTasks);
});

gulp.task('jquery-ui', function() {
  return gulp.src(['node_modules/jquery-ui/themes/redmond/*/*', "node_modules/jquery-ui/themes/redmond/jquery-ui.min.css"])
  .pipe(gulp.dest('public/stylesheets/jquery-ui/'));
});
gulp.task('font-awesome', function() {
  gulp.src("node_modules/font-awesome/css/font-awesome.min.css")
  .pipe(gulp.dest('public/stylesheets/'));
  gulp.src(["node_modules/font-awesome/fonts/fontawesome-webfont.woff2", "node_modules/font-awesome/fonts/fontawesome-webfont.woff", "node_modules/font-awesome/fonts/fontawesome-webfont.ttf"])
  .pipe(gulp.dest('public/fonts/'));
});

gulp.task('default', ['watch', 'jquery-ui', 'font-awesome']);


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

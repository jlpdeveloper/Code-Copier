var gulp = require('gulp');
var childProcess = require('child_process'),
  electron = require('electron-prebuilt'),
  concat = require('gulp-concat');

gulp.task('helloWorld', [], function () {

  console.log('helloworld');
});

gulp.task('electron-start', [], function () {
  childProcess.spawn(electron, ['.'], {
    stdio: 'inherit'
  });

});

gulp.task('build-js', [], function () {
  gulp.src('node_modules/angular/angular.min.js')
    .pipe(concat('angular.min.js'))
    .pipe(gulp.dest('libraries/angular'));

});
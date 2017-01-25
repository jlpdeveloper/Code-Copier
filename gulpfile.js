var gulp = require('gulp');
var childProcess = require('child_process'),
  electron = require('electron-prebuilt'),
  concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('helloWorld', [], function () {

  console.log('helloworld');
});

gulp.task('electron-start', ['build-js', 'build-css'], function () {
  childProcess.spawn(electron, ['.'], {
    stdio: 'inherit'
  });

});

gulp.task('build-js', [], function () {
  gulp.src([
    'node_modules/angular/angular.min.js' 
 // 'node_modules/angular-aria/angular-aria.min.js',
 // 'node_modules/angular-animate/angular-animate.min.js',
 // 'node_modules/angular-material/angular-material.min.js'
  ])
   
    .pipe(concat('angular.min.js'))
     .pipe(ngAnnotate())
    .pipe(gulp.dest('libraries/angular'));

});

gulp.task('build-css', [], function () {
  gulp.src(['node_modules/angular-material/angular-material.min.css'])
    .pipe(concat('angular.min.css'))
    .pipe(gulp.dest('libraries/angular'));

});
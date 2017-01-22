var gulp = require('gulp');
var  childProcess  = require('child_process'), 
  electron      = require('electron-prebuilt');

gulp.task('helloWorld', [], function(){

    console.log('helloworld');
});

gulp.task('electron-start', [], function(){
  childProcess.spawn(electron, ['.'], { stdio: 'inherit' }); 

});
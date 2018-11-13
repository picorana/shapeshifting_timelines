var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat', [], function() {
  gulp.src("js/**.js")
      .pipe(concat('dist.js'))
      .pipe(gulp.dest('dist/'));
});

gulp.watch('js/**/*.js', ['concat']);
const gulp = require('gulp');

gulp.task('copy-schemas', () => {
    return gulp.src([
        'src/**/*.graphql'
    ]).pipe(
        gulp.dest('dist')
    );
})

gulp.task('default', gulp.series('copy-schemas'));

import * as gulp from 'gulp';
import * as path from 'path';

gulp.task('copy-schemas', () => {
    return gulp.src(['../src/**/*.graphql']).pipe(gulp.dest('../dist/server/src'));
});

gulp.task('default', gulp.series('copy-schemas'));

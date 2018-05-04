const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const useref = require('gulp-useref')
const del = require('del')
const runSequence = require('run-sequence')

const log = (...args) => console.log('GulpTask:', ...args)
const dist = 'dist'

gulp.task('start', () => {
  return (
    gulp
      .src('app/**/*.+(html|htm)')
      // .pipe(useref())
      .pipe(gulp.dest(dist))
  )
})

gulp.task('sass', () => {
  return gulp
    .src('app/**/*.+(scss|sass)')
    .pipe(sass())
    .pipe(gulp.dest(dist))
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
})

gulp.task('watch', ['browserSync', 'sass', 'start'], () => {
  gulp.watch('app/**/*.+(scss|sass)', ['sass'])
  gulp.watch('app/**/*.html', browserSync.reload)
  gulp.watch('app/**/*.+(js|jsx)')
})

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: dist
    }
  })
})

gulp.task('clean:dist', () => {
  return del.sync(dist)
})

gulp.task('default', () => {
  runSequence('clean:dist', ['sass', 'browserSync', 'start', 'watch'], () => {
    log('start all ...')
  })
})

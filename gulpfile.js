'use strict' // eslint-disable-line strict

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const del = require('del')
const webpack = require('webpack')
const AWS = require('aws-sdk')

gulp.task('clean', () => del(['dist/**/*']))
gulp.task('build', $.sequence('clean', ['build:static', 'build:webpack']))

gulp.task('build:static', () =>
  gulp.src('index.html')
    .pipe(gulp.dest('dist'))
)

gulp.task('build:webpack', cb => {
  // We need to set NODE_ENV to production to get a deployable build
  // DON'T IMPORT THE WEBPACK CONFIG BEFORE THIS IS DONE
  $.env.set({ NODE_ENV: 'production' })
  const webpackConfig = require('./webpack.config')

  // Now run webpack with production config
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.compilation.errors.length > 0) {
      throw new $.util.PluginError('webpack', err || stats.compilation.errors[0])
    } else {
      $.util.log('[webpack]', stats.toString())
      cb()
    }
  })
})

gulp.task('publish', ['publish:s3'])

gulp.task('publish:s3', ['build'], () => {
  const awsConfig = {
    key: AWS.config.credentials.accessKeyId,
    secret: AWS.config.credentials.secretAccessKey,
    region: 'eu-west-1',
    params: {
      Bucket: 'cavegen'
    }
  }

  const publisher = $.awspublish.create(awsConfig)
  const headers = {
    'Cache-Control': 'max-age=300, public'
  }

  return gulp.src(['dist/**', '!dist/**/*.js.map'])
    .pipe(publisher.publish(headers, { force: true }))
    .pipe(publisher.cache())
    .pipe($.awspublish.reporter())
})

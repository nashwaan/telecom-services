/*jslint node:true */
'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('start', function () {
    nodemon({
            script: 'server.js',
            ext: 'js html',
            ignore: ['sessions/'],
            env: {
                'NODE_ENV': 'development'
            }
        })
        .on('restart', function () {
            console.log('nodemon restarted!');
        });
});

gulp.task('default', ['start']);
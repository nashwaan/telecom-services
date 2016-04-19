/*jslint node:true */

module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['jasmine'],
        files: [
            'app/dist/vendors-combined.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'app/app.js', 'app/filters.js', 'app/directives.js', 'app/schemas-service.js', 'app/main-body.js', 
            'app/*-part/*.js',
            'app/**/*_test.js'
        ],
        exclude: [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},
        // test results reporter to use. possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG, // LOG_DISABLE | LOG_ERROR | LOG_WARN | LOG_INFO | LOG_DEBUG
        autoWatch: true,
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'], //, 'Firefox', 'IE'],
        singleRun: false,
        concurrency: Infinity // Concurrency level: how many browser should be started simultanous
    });
};
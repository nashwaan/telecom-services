exports.config = {

    baseUrl: 'http://localhost:8008/',

    specs: ['e2e/*.js'],

    capabilities: {
        'browserName': 'chrome'
    },

    chromeOnly: true,

    framework: 'jasmine',

    allScriptsTimeout: 11000,

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }

};
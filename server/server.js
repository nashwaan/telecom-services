/*jslint node: true */
/*jslint es5: true */
/*jslint nomen: true*/
'use strict';

var fs = require('fs');
var http = require('http');
var https = require('https');
var moment = require('moment');
var morgan = require('morgan');
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var notifier = require('node-notifier');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var config = require('./config.json')[process.env.NODE_ENV];
var logger = require('./logger');

var app = express();
//var httpsOptions = { key: fs.readFileSync('ssl-key.pem'), cert: fs.readFileSync('ssl-cert.pem') };

app.use('/', function (req, res, next) {
    logger.debug('Request made', req.method + ' ' + req.url);
    next();
});
app.use(morgan('short'));
app.use(morgan('combined', {stream: fs.createWriteStream(__dirname + '/requests.log', {flags: 'a'})}));
app.use(favicon(__dirname + '/../app/favicon.ico'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(__dirname + '/../app'));
app.use(session({
    name: 'telecom-services',
    secret: 'giveMe6hoursToChopDownATree',
    saveUninitialized: true,
    resave: true,
    store: new FileStore({path: './sessions'}),
    cookie: { maxAge: 3000 }
}));

app.use('/', function printSession(req, res, next) {
    logger.debug('req.session', req.session);
    return next();
});
app.get('/', function (req, res) {
    if (!req.session.views) {
        req.session.views = 0;
    }
    req.session.views += 1;
    res.send('You view this page ' + req.session.views);
});

// anything beginning with "/api" will apply routing rules defined in /api/index.js
app.use('/api', require('./api'));

// for any unidentified route, generate 404 and forward it to error handler
app.use('/', function (req, res, next) {
    var err = new Error('404 Not Found\n' + 'This request \'' + req.url + '\' could not be resolved');
    err.status = 404;
    next(err);
});

// development error handler (SET NODE_ENV=development)
if (process.env.NODE_ENV === 'development') { // app.get('env') === 'development'
    app.use(function (err, req, res, next) {
        notifier.notify({
            title: 'Error in ' + req.method + ' ' + req.url,
            message: err.message,
            sound: false,
            wait: false
        });
        err.details = '<h4>' + moment().format('ddd DD-MM-YYYY, hh:mm:ss A') + '</h4>' +
                      '<pre>' + err.stack + '</pre>';
        logger.error(err.message);
        next(err);
    });
}

// production error handler
app.use(function (err, req, res, next) {
    var page = '<h1 style="font-family:Verdana;font-size:300%;color:#888">Oops! Something broke</h1>';
    page += '<p>' + err.reason + '</p>';
    page += err.details || '';
    res.status(err.status || 500).send(page);
});

logger.info('Server started on port: ' + (process.env.PORT || 3000));

//app.listen(process.env.PORT || 3000);
//http.createServer(app).listen(process.env.PORT || 3000);
//https.createServer(httpsOptions, app).listen(443);
module.exports = app; // type this on command prompt: npm start
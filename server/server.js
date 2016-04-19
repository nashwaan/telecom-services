/*jslint node: true */
/*jslint es5: true */
/*jslint nomen: true*/
'use strict';

var fs = require('fs');
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
app.set('port', process.env.PORT || 3000);
var server = require('http').Server(app);
var io = require('socket.io')(server);

//var httpsOptions = { key: fs.readFileSync('ssl-key.pem'), cert: fs.readFileSync('ssl-cert.pem') };
var sessionOptions = {
    name: 'telecom-services',
    secret: 'R_hDZ3G+!r-K*FPjku@XGG@j-peMEq=XVrhU7Edg',
    saveUninitialized: true,
    resave: true,
    store: new FileStore({path: './sessions'}),
    cookie: {maxAge: 50 * 1000}
};

var sessionMiddleware = session(sessionOptions);

//app.disable('x-powered-by');
app.use('/', function (req, res, next) {
    //logger.debug('Request made', req.method + ' ' + req.url, req.header('Content-Type'), req.body);
    next();
});
app.use(morgan('short'));
app.use(morgan('combined', {stream: fs.createWriteStream(__dirname + '/requests.log', {flags: 'a'})}));
app.use(favicon(__dirname + '/../app/favicon.ico'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/../app/'));
//app.use(session(sessionOptions));
app.use(sessionMiddleware);
app.use('/auth', require('./auth.js'));
app.use('/api', require('./api.js'));
app.use('/eligible', require('./eligible.js'));
io.use(function(socket, next) {
    socket.request.socketid = socket.id;
    sessionMiddleware(socket.request, socket.request.res, next); // creates socket.request.session
});

var expiringSessions = [];
app.use('/', function (req, res, next) {
    //logger.debug('req.session', req.session);
    var i;
    if (req.session.authenticated) {
        for (i = expiringSessions.length - 1; i >= 0; i -= 1) {
            if (expiringSessions[i].id === req.session.id) {
                expiringSessions.splice(i, 1);
            }
        }
        expiringSessions.push(req.session);
        (function(sessionid, userid) {
            setTimeout(function () {
                logger.info('Session expired, ', expiringSessions.length);
                for (i = expiringSessions.length - 1; i >= 0; i -= 1) {
                    if (expiringSessions[i].id === sessionid && Date.now() > expiringSessions[i].cookie.expires) {
                        expiringSessions.splice(i, 1);
                        io.to(userid).emit('logout', {});
                        logger.info('Manually logged out ', sessionid, userid);
                    }
                }
            }, req.session.cookie.maxAge + 500);
        }(req.session.id, req.session.userid));
        return next();
    } else {
        return res.status(401).send('Not authorized');
    }
});

io.on('connection', function (socket) {
    socket.request.session.socketid = socket.id;
    logger.info('Session of socket connection: ', socket.request.session.socketid, socket.request.session.id);
    socket.on('join', function (userid) {
        socket.join(userid); // We are using room of socket io
    });
});

// get routing rules from the respective files
//app.use('/api', require('./api.js'));

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
    page += '<h4>' + (err.message || 'error message not provided') + '</h4>';
    page += '<p>' + (err.reason || 'error reason not provided') + '</p>';
    page += err.details || '';
    res.status(err.status || 500).send(page);
});

logger.info('Server started on port: ' + (process.env.PORT || 3000));

server.listen(app.get('port'));
//app.listen(process.env.PORT || 3000);
//http.createServer(app).listen(process.env.PORT || 3000);
//https.createServer(httpsOptions, app).listen(443);
//module.exports = app; // type this on command prompt: npm start
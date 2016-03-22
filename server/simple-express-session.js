/*jslint node: true */
'use strict';

var app = require('express')();
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({secret: 'somesecrettokenhere'}));

app.get('/', function (req, res) {
    var html = '<form action="/" method="post">' +
                  '<p>Your name: <input type="text" name="userName"></p>' +
                  '<button type="submit">Submit</button>' +
               '</form>';
    if (req.session.userName) {
        html += '<br />Your username from your session is: ' + req.session.userName;
    }
    res.send(html);
});

app.post('/', function (req, res) {
    req.session.userName = req.body.userName;
    res.redirect('/');
});

app.listen(80);
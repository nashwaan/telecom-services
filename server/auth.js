/*jslint node:true */
'use strict';

var router = require('express').Router();
var logger = require('./logger.js');

function getRole(name) {
    return name === 'Yousuf' ? 'admin' : 'editor';
}

// POST auth/login
router.post('/login', function (req, res) {
    logger.debug('POST', req.body);
    if (!req.body || req.body.username !== 'Yousuf') {
        return res.status(401).send('Login attempt failed');
    }
    if (!req.session.authenticated) {
        req.session.authenticated = true;
        req.session.userid = req.body.username;
    }
    //logger.debug('req.session.authenticated', req.session.authenticated);
    var role = getRole(req.body.username);
    switch (role) {
        case 'admin': case 'editor': 
            return res.json({"email": req.body.username + '@etisalat.ae', "fullname": req.body.username, "role": role});
        default:
            return res.status(403).send('Authenticated but not authorized');
    }
});

// POST auth/logout
router.post('/logout', function (req, res) {
    logger.debug('POST', req.body);
    if (req.session.authenticated) {
        req.session.authenticated = false;
    }
    return res.send('Logged out successfully');
});

module.exports = router;
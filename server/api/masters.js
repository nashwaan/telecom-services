/*jslint node: true */
/*jslint es5: true */
'use strict';

var router = require('express').Router();
var assert = require('assert');
var DB = require('../mongo-db');

// middleware that is specific to api/masters
router.use('/', function timeLog(req, res, next) {
    console.log('Time: ' + Date.now() + ', Request Type: ' + req.method);
    next();
});

// GET api/masters
router.get('/', function (req, res, next) {
    DB.then(function (db) {
        db.collection('masters').find({}).toArray().then(function (items) {
            res.json({ success: true, masters: items });
        }).catch(function (err) {
            err.reason = 'Could not fetch masters items';
            next(err);
        });
    }).catch(function (err) {
        err.reason = 'Could not connect to database';
        next(err);
    });
});

// api/masters/:groupName/:collectionName/:masterName
router.get('/:groupName/:collectionName/:masterName', function (req, res, next) {
    DB.then(function (db) {
        db.collection('masters').findOne({name: req.params.groupName}).then(function (items) {
            res.json({ success: true, masters: items });
        }).catch(function (err) {
            err.reason = 'Could not fetch item in masters';
            next(err);
        });
    }).catch(function (err) {
        err.reason = 'Could not connect to database';
        next(err);
    });
});

router.post('/', function (req, res) {
    var user = req.body;
    DB.collection('data').insert(user, function (err, users) {
        if (err) {
            console.error('user already exists. ' + err);
            res.status(500).end();
        } else {
            res.send({ success: true, user: user });
        }
    });
});

// export this mini-app
module.exports = router;
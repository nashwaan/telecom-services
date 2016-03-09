/*jslint node:true */
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
router.get('/', function (req, res) {
    DB.getCollection('masters', function (err, mastersColl) {
        if (err) {
            res.status(500).end();
        } else {
            mastersColl.find({}).toArray(function (err, masters) {
                if (err) {
                    res.status(500).end();
                } else {
                    res.json({ success: true, masters: masters });
                }
                assert(!err, 'Could not access DB or collection.');
            });
        }
    });
});

// api/masters/:groupName/:collectionName/:masterName
router.get('/users/:name', function (req, res) {
    DB.getCollection('data').findOne({ name: req.params.name }, function (err, user) {
        if (err) {
            console.error(err);
            res.status(500).end();
        } else {
            if (user) {
                res.send({ success: true, user: user });
            } else {
                res.send({ success: false, reason: 'user not found: ' + req.params.name });
            }
        }
    });
});

router.post('/users', function (req, res) {
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
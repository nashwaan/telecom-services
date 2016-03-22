/*jslint node: true */
/*jslint es5: true */
'use strict';

var router = require('express').Router();
var DB = require('../mongo-db');
var logger = require('../bunyan');

// middleware that is specific to api/masters
router.use('/', function timeLog(req, res, next) {
    console.log('Time: ' + Date.now() + ', Request Type: ' + req.method);
    next();
});

// GET api/masters
router.get('/', function (req, res, next) {
    DB.then(function (db) {
        db.collection('masters').find({}).toArray().then(function (items) {
            logger.info('masters retrieved');
            //res.json({"firstName": "Hipp", "lastName": "Edgar", "phone": "0652455478", "description": "New Website"});
            res.json(items);
        }).catch(function (err) {
            err.reason = 'Could not fetch masters items';
            next(err);
        });
    }).catch(function (err) {
        err.reason = 'Could not connect to database';
        next(err);
    });
});

// GET api/masters/:groupName/:collectionName/:masterName
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

// PUT api/masters
router.put('/', function (req, res, next) {
    var masters = req.body;
    DB.then(function (db) {
        db.collection('masters').drop().then(function(reply) {
            logger.info('deleted', reply);
            db.collection('masters').insertMany(masters).then(function(reply) {
                delete reply.ops;
                res.json(reply);
                logger.info('inserted', reply);
            });
        });
    }).catch(function (err) {
        err.reason = 'Could not connect to database';
        next(err);
    });
});

// DELETE api/masters
router.delete('/', function (req, res, next) {
    DB.then(function (db) {
        db.collection('masters').drop().then(function(reply) {
            res.json({ success: true });
            logger.info(reply);
        });
    }).catch(function (err) {
        err.reason = 'Could not connect to database';
        next(err);
    });
});

// POST api/master
router.post('/', function (req, res) {
    var user = req.body;
    DB.collection('masters').insert(user, function (err, masters) {
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
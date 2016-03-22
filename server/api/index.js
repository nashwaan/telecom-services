/*jslint node:true */
'use strict';

var router = require('express').Router();
var DB = require('../mongo-db');
var logger = require('../logger.js');

// split up route handling
//router.use('/masters', require('./masters'));
//router.use('/plans', require('./plans'));

// GET api/collection/document
router.get(/^\/([^\/\?]+)(?:\/([^\/\?]+))?/, function (req, res, next) {
    logger.debug('GET', req.params, req.query);
    if (req.params[0]) {
        DB.then(function (db) {
            db.collection(req.params[0], {strict: true}, function(err, coll) {
                if (err) {
                    err.reason = 'Could not obtain ' + req.params[0] + ' collection';
                    return next(err);
                }
                if (req.params[1]) {
                    coll.find({name:req.params[1]}).limit(1).toArray().then(function (docs) {
                        logger.info(req.params[1] + ' retrieved');
                        res.json(docs);
                    }).catch(function (err) {
                        err.reason = 'Could not obtain ' + req.params[1] + ' from ' + req.params[0] + ' docs';
                        next(err);
                    });
                } else {
                    coll.find({}).toArray().then(function (items) {
                        logger.info(req.params[0] + ' retrieved');
                        res.json(items);
                    }).catch(function (err) {
                        err.reason = 'Could not obtain ' + req.params[0] + ' docs';
                        next(err);
                    });
                }
            });
        }).catch(function (err) {
            err.reason = 'Could not connect to database';
            next(err);
        });
    }
});

// PUT api/collection/document
router.put(/^\/([^\/\?]+)(?:\/([^\/\?]+))?/, function (req, res, next) {
    logger.debug('PUT', req.params, req.query);
    function process(coll) {
        if (req.params[1]) {
            coll.findOneAndDelete({name:req.params[1]}).then(function(reply) {
                logger.info('deleteOne', reply);
                coll.insertOne(req.body).then(function(reply) {
                    logger.info('insertOne', reply);
                });
            });
        } else {
            coll.drop().then(function(reply) {
                logger.info('deleted', reply);
                coll.insertMany(req.body).then(function(reply) {
                    delete reply.ops;
                    res.json(reply);
                    logger.info('inserted', reply);
                });
            });
        }
    }
    if (req.params[0]) {
        DB.then(function (db) {
            db.collection(req.params[0], {strict: true}, function(err, coll) {
                if (err) {
                    db.createCollection(req.params[0]).then(function(coll) {
                        process(coll);
                    });
                } else {
                    process(coll);
                }
            });
        }).catch(function (err) {
            err.reason = 'Could not connect to database';
            next(err);
        });
    }
});

// DELETE api/collection/document
router.delete(/^\/([^\/\?]+)(?:\/([^\/\?]+))?/, function (req, res, next) {
    logger.debug('DELETE', req.params, req.query);
    if (req.params[0]) {
        DB.then(function (db) {
            db.collection(req.params[0], {strict: true}, function(err, coll) {
                if (err) {
                    err.reason = 'Could not obtain ' + req.params[0] + ' collection';
                    return next(err);
                }
                if (req.params[1]) {
                     coll.findOneAndDelete({name:req.params[1]}).then(function(reply) {
                        logger.info('deleteOne', reply);
                    });
               } else {
                    coll.drop().then(function(reply) {
                        res.json({ success: true });
                        logger.info(reply);
                    });
                }
            });
        }).catch(function (err) {
            err.reason = 'Could not connect to database';
            next(err);
        });
    }
});

module.exports = router;
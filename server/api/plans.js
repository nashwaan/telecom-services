/*jslint node:true */
'use strict';

var router = require('express').Router();
var db = require('../mongo-db');

/*mongo.MongoClient.connect('mongodb://localhost:27017/telecom-services', function (err, database) {
    if (err) {
        console.error('Could not connect to MongoDB. ' + err);
    } else {
        console.log('Connected to MongoDB.');
        db = database;
        db.collection('masters', { strict: true }, function (err, col) {
            if (err) {
                console.error("Could not access 'masters' collection.");
                db.createCollection('masters').then(function (err, result) {
                    if (err) {
                        console.error("Could not create 'masters' collection.");
                    }
                });
            }
        });
    }
});*/

// api/plans
router.get('/', function (req, res) {
    res.json({ plans: [] });
});

// api/plans/:id
router.get('/:id', function (req, res) {
    res.json({ id: req.params.id });
});

// export this mini-app
module.exports = router;
/*jslint node:true */
'use strict';

var mongo = require('mongodb');
var Promise = require("bluebird");
var winston = require('winston');

var logger = new winston.Logger({ level: 'info', transports: [
        new (winston.transports.Console)({level: 'warn'}),
        new (require('winston-daily-rotate-file'))({level: 'verbose', filename: 'access.log', datePattern: '.yyyy-MM-dd'})
    ]});

var db = mongo.MongoClient.connect('mongodb://localhost:27017/telecom-services', { promiseLibrary: Promise });
//var db, cols = {};

function getDataBase(dbName, callback) {
    if (db) {
        return callback(null, db);
    } else {
        mongo.MongoClient.connect('mongodb://localhost:27017/telecom-services', function (err, database) {
            if (err) {
                return callback(new Error('Could not connect to MongoDB. ' + err));
            } else {
                console.log('Connected to MongoDB.');
                db = database;
            }
        });
    }
}

function getCollectionByName(db, collectionName, callback) {
    if (cols[collectionName] !== undefined) {
        return callback(null, cols[collectionName]);
    } else {
        db.collection(collectionName, { strict: true }, function (err, col) {
            if (err) {
                console.error('Could not access \'' + collectionName + '\' collection.');
                db.createCollection(collectionName, function (err, result) {
                    if (err) {
                        return callback(new Error('Could not create \'' + collectionName + '\' collection.'));
                    } else {
                        cols[collectionName] = col;
                        return callback(null, cols[collectionName]);
                    }
                });
            } else {
                cols[collectionName] = col;
                return callback(null, cols[collectionName]);
            }
        });
    }
}

// adapted from http://stackoverflow.com/questions/20238829/asynchronous-nodejs-module-exports
module.exports = {
    "getDB" : function (callback) {
        if (db) {
            return callback(null, db);
        } else {
            mongo.MongoClient.connect('mongodb://localhost:27017/telecom-services', function (err, database) {
                if (err) {
                    return callback(new Error('Could not connect to MongoDB. ' + err));
                } else {
                    console.log('Connected to MongoDB.');
                    db = database;
                    return callback(null, db);
                }
            });
        }
    },
    "getCollection" : function (collectionName, callback) {
        if (db) {
            getCollectionByName(db, collectionName, callback);
        } else {
            mongo.MongoClient.connect('mongodb://localhost:27017/telecom-services', function (err, database) {
                if (err) {
                    return callback(new Error('Could not connect to MongoDB. ' + err));
                } else {
                    console.log('Connected to MongoDB.');
                    db = database;
                    getCollectionByName(db, collectionName, callback);
                }
            });
        }
    }
};
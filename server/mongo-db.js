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

// adapted from http://stackoverflow.com/questions/20238829/asynchronous-nodejs-module-exports
module.exports = db;
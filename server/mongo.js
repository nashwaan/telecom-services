/*jslint node:true */
'use strict';

var mongo = require('mongodb');
var Promise = require("bluebird");

// list databases: show dbs
// activate database: use <db name>
// create collection: db.createCollection('customers')
// remove collection: db.customers.drop()
// list collections: show collections
// insert document: db.customers.insert({model:'Lexus',make:2010});
// remove document: db.customers.remove({make:{$gt:2000}})
// list documents: db.customers.find().pretty()

var db = mongo.MongoClient.connect('mongodb://localhost:27017/telecom-services', { promiseLibrary: Promise });
//var db, cols = {};

// adapted from http://stackoverflow.com/questions/20238829/asynchronous-nodejs-module-exports
module.exports = db;
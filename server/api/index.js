/*jslint node:true */
'use strict';

var router = require('express').Router();

// split up route handling
router.use('/masters', require('./masters'));
router.use('/plans', require('./plans'));

module.exports = router;
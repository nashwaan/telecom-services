/*jslint node:true */
'use strict';

var router = require('express').Router();
var logger = require('./logger.js');

function getRole(name) {
    return name === 'Yousuf' ? 'admin' : 'editor';
}

// POST eligible/addon
router.post('/addon', function (req, res) {
    logger.debug('POST', req.body);
    if (req.body.requestAddon === '30 GB Local Data') {
        return res.json({eligible: false, reason: '30 GB Local Data addon is not compatible with the requested base plan'});
    } else {
        return res.json({eligible: true});
    }
});

module.exports = router;
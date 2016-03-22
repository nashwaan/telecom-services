/*jslint node: true */
//cb:common name, ou: organizational unit, o: organization name, dc: domain component
'use strict';

var SUFFIX = 'o=etisalat.corp.ae';
var fs = require('fs');
var ldap = require('ldapjs');
var bunyan = require('bunyan');

var logger = bunyan.createLogger({
        name: 'ldap-server',
        streams: [ {level: 'debug', stream: process.stdout}, {level: 'debug', type:'rotating-file', path: './ldap-server.log'} ]
});

var server = ldap.createServer({log: logger});

var pre = [
    function authorize(req, res, next) {
        if (!req.connection.ldap.bindDN.equals('cn=root')) {
            logger.error('Bind to LDAP should be via root');
            return next(new ldap.InsufficientAccessRightsError());
        }
        return next();
    }
];

var users;
(function loadUsers() {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            return logger.error('Error in fs.readFile()');
        }
        users = JSON.parse(data);
    });
}());

server.bind('cn=root', function (req, res, next) {
    logger.debug('bind() called');
    if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret') {
        logger.error('Invalid root credentials');
        return next(new ldap.InvalidCredentialsError());
    }
    logger.info('Welcom ' + req.dn.toString());
    res.end();
    return next();
});

/*server.use(function (req, res, next) {
    logger.debug('server.use() called');
    if (!users) {
        logger.error('No users data');
        return next(new ldap.OperationsError());
    }
    req.users = {};
    var i;
    for (i = 0; i < users.length; i += 1) {
        req.users[users[i].sAMAccountName] = {
            dn: 'cn=' + users[i].sAMAccountName + ', ou=' + users[i].ou + ', ' + SUFFIX,
            attributes: users[i]
        };
        req.users[users[i].sAMAccountName].attributes.cn = users[i].sAMAccountName;
        req.users[users[i].sAMAccountName].attributes.objectclass = 'user';
    }
    logger.info('Users data is ready');
    return next();
});*/

server.search(SUFFIX, pre[0], function (req, res, next) {
    var key;
    for (key in req.users) {
        if (req.users.hasOwnProperty(key)) {
            if (req.filter.matches(req.users[key].attributes)) {
                res.send(req.users[key]);
            }
        }
    }
    res.end();
    return next();
});

server.compare(SUFFIX, pre[0], function (req, res, next) {
    var i, dn = req.dn.toString(), vals, matched = false;
    logger.info('Doing compare for ' + req.users[dn]);
    if (!req.users[dn]) {
        logger.error('Error in !req.users[dn]');
        return next(new ldap.NoSuchObjectError(dn));
    }
    if (!req.users[dn][req.attribute]) {
        logger.error('Error in !req.users[dn][req.attribute]');
        return next(new ldap.NoSuchAttributeError(req.attribute));
    }
    vals = req.users[dn][req.attribute];
    for (i = 0; i < vals.length; i += 1) {
        if (vals[i] === req.value) {
            matched = true;
            break;
        }
    }
    res.end(matched);
    return next();
});

server.listen(389, '127.0.0.1', function () {
    logger.info('Simple users LDAP server up at %s', server.url);
});
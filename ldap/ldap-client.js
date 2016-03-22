/*jslint node: true */
//cb:common name, ou: organizational unit, o: organization name, dc: domain component
'use strict';

var ldap = require('ldapjs');
var SUFFIX = 'o=etisalat.corp.ae';
var bunyan = require('bunyan');

var logger = bunyan.createLogger({
    name: 'ldap-client',
    streams: [ {level: 'trace', stream: process.stdout}, {level: 'trace', type:'rotating-file', path: './ldap-client.log'} ]
});

var client;
try {
    client = ldap.createClient({url: 'ldap://127.0.0.1:389'});
} catch (e) {
    logger.error(e);
}

if (client) {
    
    client.bind('cn=root', 'secret', function(err) {
        if (err) {
            return logger.error(err);
        }
        logger.debug('client.bind() success.');
        
        client.compare('cn=yalmarzooqi', 'sn', 'bar', function(err, matched) {
            if (err) {
                return logger.error('LDAP server returned error while doing compare()');
            }
            logger.info('matched: ' + matched);
        });

        /*var opts = {
            filter: '(&(l=Seattle)(email=*@foo.com))',
            scope: 'sub',
            attributes: ['dn', 'sn', 'cn']
        };
        client.search(SUFFIX, opts, function (err, res) {
            if (err) {
                return logger.error(err);
            }
            res.on('searchEntry', function (entry) {
                logger.debug('entry: ' + JSON.stringify(entry.object));
            });
            res.on('searchReference', function (referral) {
                logger.debug('referral: ' + referral.uris.join());
            });
            res.on('error', function (err) {
                logger.debug('error: ' + err.message);
            });
            res.on('end', function (result) {
                logger.debug('status: ' + result.status);
            });
        });*/
        client.unbind(function(err) {
            if (err) {
                return logger.error(err);
            }
            logger.debug('client.unbind() success.');
        });
    });
}
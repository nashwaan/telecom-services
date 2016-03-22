/*jslint node: true */

module.exports = require('bunyan').createLogger({
    name: 'telecom-services-server',
    streams: [ 
        {level: 'trace', stream: process.stdout}, 
        {level: 'trace', type:'rotating-file', path: './server.log'} 
    ]
});
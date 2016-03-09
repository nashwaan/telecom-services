/*jslint node:true */
'use strict';

var notifier = require('node-notifier');
var path = require('path');

var options = {
    title: 'My awesome title',
    message: 'Hello from node, Mr. User!',
    //icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons) 
    sound: true, // Only Notification Center or Windows Toasters 
    wait: true // Wait with callback, until user action is taken against notification 
};

notifier.notify(options, function (err, response) {
    // Response is response from notification 
});
 
new notifier.NotificationCenter(options).notify();
new notifier.NotifySend(options).notify();
new notifier.WindowsToaster(options).notify(options);
new notifier.WindowsBalloon(options).notify(options);
new notifier.Growl(options).notify(options);
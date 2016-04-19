// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    angular.module('TheApp')
        .filter('icon_file', function () {
            return function (input, uppercase) {
                input = input || '';
                var filename = input.replace(/\s+/g, ''); // remove all white space characters
                if (uppercase) {
                    filename = filename.toUpperCase();
                }
                return 'icon' + filename;
            };
        })
        .filter('icon_provider', function () {
            return function (input) {
                input = input || 'generic'; // default to 'generic' if no input is supplied
                var svgId = input.replace(/\s+/g, ''); // remove all white space characters
                return 'master:' + svgId;
            };
        });

}(window.angular));
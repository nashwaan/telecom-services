// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    //
    angular.module('stencilApp').filter('icon_file', function () {
        return function (input, uppercase) {

            // ensure the input is a valid string
            input = input || '';

            // remove white space from the string (regex: \s white space  + one or more occurance  /g global search)
            var filename = input.replace(/\s+/g, '');

            // conditional based on optional argument
            if (uppercase) {
                filename = filename.toUpperCase();
            }

            // prepend 'icon' to filename
            return 'icon' + filename;
        };

    });

}(window.angular));
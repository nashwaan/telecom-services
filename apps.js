// silence JSLint error: variable used before it was defined
/*global angular*/

(function () {
    'use strict';

    // initialize 'stencilApp' module
    angular.module('stencilApp', ['dndLists']);

    // initialize 'canvasApp' module
    angular.module('canvasApp', ['dndLists']);

}());

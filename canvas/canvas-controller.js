// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for 'canvasApp'
    angular.module('canvasApp').controller('canvasController', function ($scope) {
        $scope.qty = 5;
        $scope.cost = 4;

    });

}(window.angular));

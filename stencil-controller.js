// silence JSLint error: variable used before it was defined
/*global angular*/
/*global properties_attributes*/


(function (angular) {
    'use strict';

    // define controller for 'stencilApp'
    angular.module('stencilApp').controller('stencilController', function ($scope) {
        $scope.qty = 5;
        $scope.cost = 4;
        
        // load properties array into the current scope
        $scope.properties = properties_attributes;
        window.console.log("$scope.properties is loaded successfully");

    });

}(window.angular));
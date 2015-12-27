// silence JSLint error: variable used before it was defined
/*global angular*/
/*global properties_attributes*/


(function (angular) {
    'use strict';

    // define controller for stencil
    angular.module('TheApp').controller('stencilController', ['$scope', '$http', function ($scope, $http) {

        //  
        $http.get('data/masters.json').success(function (data) {

            $scope.stencil = {
                selectedMaster: null,
                masters: data
            };

            window.console.log("properties data was loaded successfully.");

        });

    }]);

}(window.angular));
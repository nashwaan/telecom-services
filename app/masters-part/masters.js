// silence JSLint error: variable used before it was defined
/*global angular*/
/*global properties_attributes*/


(function (angular) {
    'use strict';

    // define controller for masters
    angular.module('TheApp').controller('mastersController', ['$scope', '$http', function ($scope, $http) {

        //  
        $http.get('data/masters.json').success(function (data) {

            $scope.panel = {
                selectedMaster: null,
                masters: data
            };

            window.console.log("Masters data was loaded successfully.");

        });

    }]);

}(window.angular));
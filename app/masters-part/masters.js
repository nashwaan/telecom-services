// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('mastersService', ['$http', '$q', function ($http, $q) {

        var masters = {};

        return masters;

    }]);

    // define controller for masters
    angular.module('TheApp').controller('mastersController', ['$scope', '$http', 'mastersService', function ($scope, $http, mastersService) {

        $http.get('data/masters.json').success(function (data) {

            //
            window.console.log("Masters data was retrieved successfully.");

            /*$scope.panel = {
                "groups": data
            };*/

            //
            mastersService.groups = data; //window.alert("mastersService.length " + mastersService.length);
            
            //
            $scope.panel = {
                "groups": mastersService.groups
            };
            
        });

    }]);

}(window.angular));
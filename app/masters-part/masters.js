// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('mastersService', ['$http', '$q', function ($http, $q) {

        var masters = null;

        return masters;

    }]);

    // define controller for masters
    angular.module('TheApp').controller('mastersController', ['$scope', '$http', 'mastersService', function ($scope, $http, mastersService) {

        $http.get('data/masters.json').success(function (data) {

            $scope.panel = {
                "groups": data
            };

            //
            window.console.log("Masters data was loaded successfully.");

            //
            mastersService = data; //window.alert("mastersService.length " + mastersService.length);
            
        });

    }]);

}(window.angular));
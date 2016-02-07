// silence JSLint error: variable used before it was defined
/*global angular*/
/*global console*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('schemasService', ['$http', function ($http) {
        var schemas, masterIcons;

        (function loadSchemas(path) {
            $http.get(path).then(function (response) {
                schemas = response.data;
            }, function (response) {
                console.warn("Could not load schemas." + response.status);
            });
        }('data/schemas.json'));

        (function loadMasterIcons(path) {
            $http.get(path).then(function (response) {
                masterIcons = response.data;
            }, function (response) {
                console.warn("Could not load masters icons." + response.status);
            });
        }('data/master-icons.json'));

        return {
            masterIcons: function () {
                return masterIcons;
            },
            schema: function (objectName) {
                return schemas[objectName + 'Schema'];
            },
            fresh: function (objectName) {
                return schemas[objectName + 'Fresh'];
            }
        };
    }]);

}(window.angular));
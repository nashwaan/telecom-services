// silence JSLint error: variable used before it was defined
/*global angular*/
/*global console*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('schemasService', ['$http', function ($http) {
        var schemas, masterIcons;

        function findSchema(name) {
            if (schemas) {
                var i;
                for (i = 0; i < schemas.length; i += 1) {
                    if (schemas[i].name === name) {
                        return schemas[i];
                    }
                }
            }
        }
        
        (function loadSchemas(path) {
            $http.get(path).then(function (response) {
                schemas = response.data;
            }, function (response) {
                console.warn("Could not load schemas." + response.status);
            });
        }('api/schemas'));

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
                var schema = findSchema(objectName);
                return schema ? schema.schema : null;
            },
            fresh: function (objectName) {
                var schema = findSchema(objectName);
                return schema ? schema.fresh : null;
            }
        };
    }]);

}(window.angular));
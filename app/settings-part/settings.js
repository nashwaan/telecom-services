// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define service for settings
    angular.module('TheApp').factory('settingsService', function () {
        var settings = null,
            valuesSaved = null,
            valuesTracked = null,
            saveValues = function () {
                valuesSaved = angular.copy(valuesTracked);
                delete valuesSaved.value; // don't track 'value' property 
            };
        return {
            "set": function (schema, values) {
                settings = schema;
                valuesTracked = values;
                saveValues();
                var key;
                for (key in valuesSaved) {
                    if (valuesSaved.hasOwnProperty(key)) {
                        settings.properties[key].value = angular.copy(values[key]);
                    }
                }
            },
            "get": function () {
                return settings;
            },
            "update": function () {
                var key;
                for (key in valuesSaved) {
                    if (valuesSaved.hasOwnProperty(key)) {
                        valuesTracked[key] = angular.copy(settings.properties[key].value);
                    }
                }
                saveValues();
            },
            "revert": function () {
                var key;
                for (key in valuesSaved) {
                    if (valuesSaved.hasOwnProperty(key)) {
                        settings.properties[key].value = valuesSaved[key];
                    }
                }
            },
            "isDirty": function () {
                var key;
                for (key in valuesSaved) {
                    if (valuesSaved.hasOwnProperty(key)) {
                        if (!angular.equals(settings.properties[key].value, valuesSaved[key])) {
                            return true;
                        }
                    }
                }
                return false;
            },
            "check": function () {
                window.alert(JSON.stringify(valuesTracked));
            }
        };
    });

    // define controller for settings
    angular.module('TheApp').controller('settingsController', ['$rootScope', '$scope', '$http', 'settingsService', 'mastersService', function ($rootScope, $scope, $http, settingsService, mastersService) {

        this.settings = settingsService;

        this.updateValues = function (e) {
            settingsService.update();
        };

        this.revertValues = function (e) {
            settingsService.revert();
        };

        this.check = function () {
            settingsService.check();
        };

        //
        $http.get('data/test-settings.json').success(function (data) {

            $scope.schema = data;

            window.console.log("Settings data was loaded successfully.");

        });

    }]);

}(window.angular));
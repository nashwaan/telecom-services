// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define service for properties
    angular.module('TheApp').factory('propertiesService', function () {
        var properties = null,
            valuesSaved = null,
            valuesTracked = null,
            ignoreProperties = "",
            saveValues = function () {
                valuesSaved = angular.copy(valuesTracked);
                if (valuesSaved) {
                    var i, ignorePropertyList = ignoreProperties.split(";");
                    for (i = 0; i < ignorePropertyList.length; i += 1) {
                        if (valuesSaved.hasOwnProperty(ignorePropertyList[i])) {
                            delete valuesSaved[ignorePropertyList[i]];
                        }
                    }
                }
            };
        return {
            "manage": function (schema, values, ignoreObjectProperties) {
                properties = schema;
                valuesTracked = values;
                ignoreProperties = ignoreObjectProperties;
                saveValues();
                if (values !== undefined) {
                    //window.console.log(JSON.stringify(properties.properties));
                    //window.console.log(JSON.stringify(values));
                    var key;
                    for (key in valuesSaved) {
                        if (valuesSaved.hasOwnProperty(key) && properties.properties.hasOwnProperty(key)) {
                            properties.properties[key].value = angular.copy(values[key]);
                        }
                    }

                }
            },
            "get": function () {
                return properties;
            },
            "update": function () {
                var key;
                for (key in valuesSaved) {
                    if (valuesSaved.hasOwnProperty(key) && properties.properties.hasOwnProperty(key)) {
                        valuesTracked[key] = angular.copy(properties.properties[key].value);
                    }
                }
                saveValues();
            },
            "revert": function () {
                var key;
                for (key in valuesSaved) {
                    if (valuesSaved.hasOwnProperty(key) && properties.properties.hasOwnProperty(key)) {
                        properties.properties[key].value = valuesSaved[key];
                    }
                }
            },
            "isDirty": function () {
                if (valuesTracked === undefined) {
                    return false;
                }
                var key;
                for (key in valuesSaved) {
                    if (valuesSaved.hasOwnProperty(key) && properties.properties.hasOwnProperty(key)) {
                        if (!angular.equals(properties.properties[key].value, valuesSaved[key])) {
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

    // define controller for properties
    angular.module('TheApp').controller('propertiesController', ['propertiesService', 'mastersService', function (propertiesService, mastersService) {

        this.properties = propertiesService;

        this.updateValues = function (e) {
            propertiesService.update();
        };

        this.revertValues = function (e) {
            propertiesService.revert();
        };

        this.check = function () {
            propertiesService.check();
        };

    }]);

}(window.angular));
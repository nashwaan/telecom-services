// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define service for properties
    angular.module('TheApp').factory('propertiesService', function () {
        var properties = null,
            valuesSaved = null,
            valuesTracked = null,
            ignoreProperties = "";

        function saveValues() {
            valuesSaved = angular.copy(valuesTracked);
            if (valuesSaved) {
                var key, i, ignorePropertyList;
                for (key in properties.properties) {
                    if (properties.properties.hasOwnProperty(key) && !valuesSaved.hasOwnProperty(key)) {
                        if (properties.properties[key].hasOwnProperty('default')) {
                            valuesSaved[key] = properties.properties[key]['default'];
                        } else {
                            valuesSaved[key] = null;
                        }
                    }
                }
                ignorePropertyList = ignoreProperties.split(";");
                for (i = 0; i < ignorePropertyList.length; i += 1) {
                    if (valuesSaved.hasOwnProperty(ignorePropertyList[i])) {
                        delete valuesSaved[ignorePropertyList[i]];
                        delete properties.properties[ignorePropertyList[i]];
                    }
                }
            }
        }

        return {
            "manage": function (schema, values, ignoreObjectProperties) {
                properties = angular.copy(schema);
                valuesTracked = values;
                ignoreProperties = ignoreObjectProperties;
                saveValues();
                if (values !== undefined) {
                    var key;
                    /*for (key in valuesSaved) {
                        if (valuesSaved.hasOwnProperty(key) && properties.properties.hasOwnProperty(key)) {
                            properties.properties[key].value = angular.copy(values[key]);
                        }
                    }*/
                    for (key in properties.properties) {
                        if (properties.properties.hasOwnProperty(key)) {
                            if (valuesSaved.hasOwnProperty(key)) {
                                properties.properties[key].value = angular.copy(values[key]);
                            } else if (properties.properties[key].hasOwnProperty('default')) {
                                properties.properties[key].value = angular.copy(properties.properties[key]['default']);
                            } else {
                                properties.properties[key].value = null;
                            }
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
    angular.module('TheApp').controller('propertiesController', ['navigationService', 'propertiesService', 'mastersService', function (navigationService, propertiesService, mastersService) {
        var self = this;
        self.showDescription = false;
        self.isDocked = function (componentId) {
            return navigationService.isSidenavLocked(componentId);
        };
        self.properties = propertiesService;
        self.updateValues = function (ev) {
            propertiesService.update();
        };
        self.isPropertiesDirty = function () {
            return propertiesService.isDirty();
        };
        self.revertValues = function (ev) {
            propertiesService.revert();
        };
        self.check = function () {
            propertiesService.check();
        };
        self.getProperties = function () {
            return propertiesService.get();
        };

    }]);

}(window.angular));
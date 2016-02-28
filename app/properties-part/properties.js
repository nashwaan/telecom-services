// silence JSLint error: variable used before it was defined
/*global angular*/
/*global console*/


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
                ignoreProperties.forEach(function (ignoreProperty) {
                    if (valuesSaved.hasOwnProperty(ignoreProperty)) {
                        delete valuesSaved[ignoreProperty];
                    }
                    if (properties.properties.hasOwnProperty(ignoreProperty)) {
                        delete properties.properties[ignoreProperty];
                    }
                });
                angular.forEach(properties.properties, function (property, key) {
                    if (!valuesSaved.hasOwnProperty(key)) {
                        valuesSaved[key] = null;
                    }
                });
            }
        }

        return {
            "manage": function (schema, values, ignoreObjectProperties) {
                if (!schema) {
                    console.error("schema not provided");
                    return;
                }
                if (values && values === valuesTracked) {
                    return;
                }
                properties = angular.copy(schema);
                valuesTracked = values;
                ignoreProperties = ignoreObjectProperties;
                saveValues();
                if (properties.required) {
                    properties.required.forEach(function (required) {
                        if (properties.properties[required]) {
                            properties.properties[required].mandatory = true;
                        }
                    });
                }
                angular.forEach(properties.properties, function (property, key) {
                    if (valuesSaved && valuesSaved.hasOwnProperty(key) && valuesSaved[key] !== null) {
                        property.value = angular.copy(valuesSaved[key]);
                    } else if (property.hasOwnProperty('default')) {
                        property.value = angular.copy(property['default']);
                    } else {
                        switch (property.type) {
                        case "string":
                            property.value = "";
                            break;
                        case "number":
                            if (property.minimum) {
                                property.value = property.minimum;
                            } else {
                                property.value = 0;
                            }
                            break;
                        case "boolean":
                            property.value = false;
                            break;
                        case "array":
                            property.value = [];
                            break;
                        case "object":
                            property.value = {};
                            break;
                        default:
                            property.value = null;
                        }
                    }
                    if (property.value instanceof Array && property.format.indexOf('array-') >= 0) {
                        property.options = property.options || [];
                        property.options = property.options.concat(property.value.filter(function (item) {
                            return property.options.indexOf(item) < 0;
                        }));
                    }
                });
            },
            "get": function () {
                return properties;
            },
            "update": function () {
                angular.forEach(properties.properties, function (property, key) {
                    if (valuesSaved.hasOwnProperty(key)) {
                        valuesTracked[key] = angular.copy(property.value);
                    }
                    if (properties.title === 'Attribute') {
                        if (key === 'enum' && property.value && property.value.length === 0) {
                            delete valuesTracked[key];
                        }
                    }
                });
                saveValues();
            },
            "revert": function () {
                angular.forEach(properties.properties, function (property, key) {
                    if (valuesSaved.hasOwnProperty(key)) {
                        property.value = valuesSaved[key];
                    }
                });
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
            "isDisabled": function () {
                return valuesTracked === undefined;
            },
            "check": function () {
                window.alert(JSON.stringify(valuesTracked));
            }
        };
    });

    // define controller for properties
    angular.module('TheApp').controller('propertiesController', ['navigationService', 'propertiesService', 'mastersService', function (navigationService, propertiesService, mastersService) {
        var self = this;
        self.isDocked = function (componentId) {
            return navigationService.isSidenavLocked(componentId);
        };
        self.updateValues = function (ev) {
            propertiesService.update();
        };
        self.submittable = function (form) {
            //console.log(JSON.stringify(form));
            angular.forEach(form, function (input) {

            });
            return true;
        };
        self.isPropertiesDirty = function () {
            return propertiesService.isDirty();
        };
        self.isPropertiesDisabled = function () {
            return propertiesService.isDisabled();
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
        self.jsonToText = function (obj) {
            return JSON.stringify(obj);
        };
        self.makeJson = function (text) {
            try {
                var obj = JSON.parse(text);
                if (obj && typeof obj === "object") {
                    return obj;
                }
            } catch (e) {}
            return null;
        };
        self.isValidDependencies = function (property) {
            var i, key, properties, orValues;
            function checkDependentValue(dependentName, dependentValue) {
                if (dependentValue.charAt(0) === "!") {
                    return dependentName.value !== dependentValue.slice(1);
                } else {
                    return dependentName.value === dependentValue;
                }
            }
            if (property && property.dependents) {
                properties = propertiesService.get().properties;
                for (key in property.dependents) {
                    if (property.dependents.hasOwnProperty(key)) {
                        if (property.dependents[key] instanceof Array) {
                            orValues = false;
                            for (i = 0; i < property.dependents[key].length; i += 1) {
                                orValues = orValues || checkDependentValue(properties[key], property.dependents[key][i]);
                            }
                            if (orValues === false) {
                                return false;
                            }
                        } else {
                            if (!checkDependentValue(properties[key], property.dependents[key])) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        };
    }]);

}(window.angular));
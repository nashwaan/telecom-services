// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for navigation
    angular.module('TheApp').controller('manufactureController', ['$rootScope', '$scope', 'mastersService', 'settingsService', function ($rootScope, $scope, mastersService, settingsService) {

        // Model to JSON for demo purpose
        /*$scope.$watch('models', function (model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);*/

        $rootScope.selected = {
            "item": null,
            "type": undefined
        };

        this.masterEdit = {
            "Attributes": []
        };

        //
        this.newMaster = function () {

            //
            var master = {
                "Attributes": [],
                "schema": {
                    "Group": "",
                    "Collection": "",
                    "Name": "",
                    "Icon": "",
                    "Type": ""
                }
            };

            //
            this.masterEdit = master;

            //
            this.editMaster(master);

        };

        //
        this.editMaster = function (master) {

            //
            var masterSchema = {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "id": "http://www.etisalat.ae",
                "title": "Master schema.",
                "description": "Schema for editing settings of a master.",
                "type": "object",
                "additionalProperties": true,
                "properties": {
                    "Group": {
                        "title": "Group Name",
                        "description": "Specify group name for this master.",
                        "type": "string",
                        "default": ""
                    },
                    "Collection": {
                        "title": "Collection Name",
                        "description": "Specify group name for this master.",
                        "type": "string",
                        "default": ""
                    },
                    "Name": {
                        "title": "Master Name",
                        "description": "Specify name for this master.",
                        "type": "string",
                        "default": ""
                    },
                    "Icon": {
                        "title": "Icon",
                        "description": "Specify icon for the master.",
                        "type": "string",
                        "enum": ["Device", "Charge", "Call", "Message", "Data"],
                        "default": ""
                    },
                    "Type": {
                        "title": "Type",
                        "description": "Specify type of the master.",
                        "type": "string",
                        "enum": ["Standard", "Modifier"],
                        "default": ""
                    }
                }
            };

            //
            settingsService.set(masterSchema, master.schema); //window.alert(JSON.stringify(settingsService.get()));

        };

        //
        this.addAttribute = function () {

            //
            var attribute = {
                "schema": {
                    "title": "No Title",
                    "description": "No Description",
                    "type": "string",
                    "enum": [],
                    "required": false,
                    "minLength": 0,
                    "maxLength": 100,
                    "minimum": 0,
                    "exclusiveMinimum": false,
                    "maximum": 0,
                    "exclusiveMaximum": false,
                    "multipleOf": 1,
                    "default": ""
                }
            };

            //
            this.masterEdit.Attributes.push(attribute);

            //
            this.editAttribute(attribute);

        };

        //
        this.editAttribute = function (attribute) {

            //
            var attributeSchema = {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "id": "http://www.etisalat.ae",
                "title": "Attribute schema.",
                "description": "Schema for editing settings of an attribute.",
                "type": "object",
                "additionalProperties": true,
                "properties": {
                    "title": {
                        "title": "Name of Sub-attribute",
                        "description": "For 'title' of sub-attribute schema.",
                        "type": "string",
                        "default": ""
                    },
                    "description": {
                        "title": "Description of Sub-attribute",
                        "description": "For 'description' of sub-attribute schema.",
                        "type": "string",
                        "default": ""
                    },
                    "type": {
                        "title": "Type of Sub-attribute",
                        "description": "For 'type' of sub-attribute schema.",
                        "type": "string",
                        "enum": ["string", "number", "boolean", "choice", "options"],
                        "default": ""
                    },
                    "required": {
                        "title": "Required Sub-attribute?",
                        "description": "For 'type' of sub-attribute schema.",
                        "type": "boolean",
                        "default": ""
                    },
                    "enum": {
                        "title": "Enum of Sub-attribute",
                        "description": "For 'enum' of sub-attribute schema.",
                        "type": "array",
                        "default": ""
                    },
                    "minLength": {
                        "title": "Minimum Length of Sub-attribute",
                        "description": "For 'minLength' of sub-attribute schema.",
                        "type": "number",
                        "default": ""
                    },
                    "maxLength": {
                        "title": "Maximum Length of Sub-attribute",
                        "description": "For 'maxLength' of sub-attribute schema.",
                        "type": "number",
                        "default": ""
                    },
                    "minimum": {
                        "title": "Minimum of Sub-attribute",
                        "description": "For 'minimum' of sub-attribute schema.",
                        "type": "number",
                        "default": ""
                    },
                    "exclusiveMinimum": {
                        "title": "Exclusive Minimum?",
                        "description": "For 'exclusiveMinimum' of sub-attribute schema.",
                        "type": "boolean",
                        "default": ""
                    },
                    "maximum": {
                        "title": "Maximum of Sub-attribute",
                        "description": "For 'maximum' of sub-attribute schema.",
                        "type": "number",
                        "default": ""
                    },
                    "exclusiveMaximum": {
                        "title": "Exclusive Maximum?",
                        "description": "For 'exclusiveMaximum' of sub-attribute schema.",
                        "type": "boolean",
                        "default": ""
                    },
                    "multipleOf": {
                        "title": "Step of Sub-attribute",
                        "description": "For 'multipleOf' of sub-attribute schema.",
                        "type": "number",
                        "minimum": 0,
                        "exclusiveMinimum": true,
                        "maximum": 1000,
                        "exclusiveMaximum": false,
                        "default": ""
                    },
                    "default": {
                        "title": "Default of Sub-attribute",
                        "description": "For 'default' of sub-attribute schema.",
                        "type": "string",
                        "default": ""
                    }
                }
            };

            //
            settingsService.set(attributeSchema, attribute.schema); //window.alert(JSON.stringify(settingsService.get()));

        };

    }]);

}(window.angular));
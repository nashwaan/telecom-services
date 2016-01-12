// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('schemasService', [function () {
        return {
            masterFresh: function () {
                return {
                    "name": "",
                    "description": "",
                    "icon": "",
                    "type": "",
                    "Attributes": [],
                    "groupName": "",
                    "collectionName": ""
                };
            },
            masterSchema: function () {
                return {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "http://www.etisalat.ae",
                    "title": "Master",
                    "description": "Edit master properties.",
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                        "name": {
                            "title": "Master Name",
                            "description": "Specify name for this master.",
                            "type": "string",
                            "default": ""
                        },
                        "description": {
                            "title": "Master Description",
                            "description": "Specify description for this master.",
                            "type": "string",
                            "default": ""
                        },
                        "icon": {
                            "title": "Icon",
                            "description": "Specify icon for the master.",
                            "type": "string",
                            "enum": ["Device", "Charge", "Call", "Message", "Data"],
                            "default": ""
                        },
                        "type": {
                            "title": "Type",
                            "description": "Specify type of the master.",
                            "type": "string",
                            "enum": ["Standard", "Modifier"],
                            "default": ""
                        },
                        "groupName": {
                            "title": "Group Name",
                            "description": "Specify group name for this master.",
                            "type": "string",
                            "default": ""
                        },
                        "collectionName": {
                            "title": "Collection Name",
                            "description": "Specify collection name for this master.",
                            "type": "string",
                            "default": ""
                        }
                    }
                };
            },
            attributeFresh: function () {
                return {
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
            },
            attributeSchema: function () {
                return {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "http://www.etisalat.ae",
                    "title": "Attribute",
                    "description": "Edit attribute properties.",
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                        "title": {
                            "title": "Name of attribute",
                            "description": "For 'title' of attribute schema.",
                            "type": "string",
                            "default": ""
                        },
                        "description": {
                            "title": "Description of attribute",
                            "description": "For 'description' of attribute schema.",
                            "type": "string",
                            "default": ""
                        },
                        "type": {
                            "title": "Type of attribute",
                            "description": "For 'type' of attribute schema.",
                            "type": "string",
                            "enum": ["string", "number", "boolean", "choice", "options"],
                            "default": ""
                        },
                        "required": {
                            "title": "Required attribute?",
                            "description": "For 'type' of attribute schema.",
                            "type": "boolean",
                            "default": ""
                        },
                        "enum": {
                            "title": "Enum of attribute",
                            "description": "For 'enum' of attribute schema.",
                            "type": "array",
                            "default": ""
                        },
                        "minLength": {
                            "title": "Minimum Length of attribute",
                            "description": "For 'minLength' of attribute schema.",
                            "type": "number",
                            "default": ""
                        },
                        "maxLength": {
                            "title": "Maximum Length of attribute",
                            "description": "For 'maxLength' of attribute schema.",
                            "type": "number",
                            "default": ""
                        },
                        "minimum": {
                            "title": "Minimum of attribute",
                            "description": "For 'minimum' of attribute schema.",
                            "type": "number",
                            "default": ""
                        },
                        "exclusiveMinimum": {
                            "title": "Exclusive Minimum?",
                            "description": "For 'exclusiveMinimum' of attribute schema.",
                            "type": "boolean",
                            "default": ""
                        },
                        "maximum": {
                            "title": "Maximum of attribute",
                            "description": "For 'maximum' of attribute schema.",
                            "type": "number",
                            "default": ""
                        },
                        "exclusiveMaximum": {
                            "title": "Exclusive Maximum?",
                            "description": "For 'exclusiveMaximum' of attribute schema.",
                            "type": "boolean",
                            "default": ""
                        },
                        "multipleOf": {
                            "title": "Step of attribute",
                            "description": "For 'multipleOf' of attribute schema.",
                            "type": "number",
                            "minimum": 0,
                            "exclusiveMinimum": true,
                            "maximum": 1000,
                            "exclusiveMaximum": false,
                            "default": ""
                        },
                        "default": {
                            "title": "Default of attribute",
                            "description": "For 'default' of attribute schema.",
                            "type": "string",
                            "default": ""
                        }
                    }
                };
            },
            planFresh: function () {
                return {
                    "name": "",
                    "description": "",
                    "Bands": []
                };
            },
            planSchema: function () {
                return {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "http://www.etisalat.ae",
                    "title": "Plan",
                    "description": "Edit plan properties.",
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                        "name": {
                            "title": "Plan Name",
                            "description": "Specify name for this plan.",
                            "type": "string",
                            "default": ""
                        },
                        "description": {
                            "title": "Plan Description",
                            "description": "Specify description for this plan.",
                            "type": "string",
                            "default": ""
                        }
                    }
                };
            },
            bandFresh: function () {
                return {
                    "name": "",
                    "description": "",
                    "Flavors": []
                };
            },
            bandSchema: function () {
                return {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "http://www.etisalat.ae",
                    "title": "Band",
                    "description": "Edit band properties.",
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                        "name": {
                            "title": "Band Name",
                            "description": "Specify name for this band.",
                            "type": "string",
                            "default": ""
                        },
                        "description": {
                            "title": "Band Description",
                            "description": "Specify description for this band.",
                            "type": "string",
                            "default": ""
                        }
                    }
                };
            },
            flavorFresh: function () {
                return {
                    "name": "",
                    "description": "",
                    "Features": []
                };
            },
            flavorSchema: function () {
                return {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "http://www.etisalat.ae",
                    "title": "Flavor",
                    "description": "Edit flavor properties.",
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                        "name": {
                            "title": "Flavor Name",
                            "description": "Specify name for this flavor.",
                            "type": "string",
                            "default": ""
                        },
                        "description": {
                            "title": "Flavor Description",
                            "description": "Specify description for this flavor.",
                            "type": "string",
                            "default": ""
                        }
                    }
                };
            },
            featureFresh: function () {
                return {
                    "name": "",
                    "description": "",
                    "Attributes": []
                };
            },
            featureSchema: function () {
                return {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "http://www.etisalat.ae",
                    "title": "Feature",
                    "description": "Edit feature properties.",
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                        "name": {
                            "title": "Feature Name",
                            "description": "Specify name for this feature.",
                            "type": "string",
                            "default": ""
                        },
                        "description": {
                            "title": "Feature Description",
                            "description": "Specify description for this feature.",
                            "type": "string",
                            "default": ""
                        }
                    }
                };
            }
        };
    }]);

}(window.angular));
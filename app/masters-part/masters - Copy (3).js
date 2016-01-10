// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('mastersService', ['$http', '$q', function ($http, $q) {
        var masters = null,
            masterSelected,
            findGroup = function (masters, groupName) {
                var i, group = null;
                for (i = 0; i < masters.Groups.length; i += 1) {
                    if (masters.Groups[i].name === groupName) {
                        group = masters[i];
                    }
                }
                return group;
            },
            findCollection = function (group, collectionName) {
                var i, collection = null;
                for (i = 0; i < group.Collections.length; i += 1) {
                    if (group.Collections[i].name === collectionName) {
                        collection = group.Collections[i];
                    }
                }
                return collection;
            },
            findMaster = function (collection, masterName) {
                var i, master = null;
                for (i = 0; i < collection.Masters.length; i += 1) {
                    if (collection.Masters[i].name === masterName) {
                        master = collection.Masters[i];
                    }
                }
                return master;
            },
            load = function (path) {
                $http.get(path).success(function (data) {
                    masters = data;
                    window.console.log("Masters data was retrieved successfully.");
                    var i, j, k, feature, Features;
                    for (i = 0; i < masters.Groups.length; i += 1) {
                        for (j = 0; j < masters.Groups[i].Collections.length; j += 1) {
                            for (k = 0; k < masters.Groups[i].Collections[j].Masters.length; k += 1) {
                                Features = angular.copy(masters.Groups[i].Collections[j].Masters[k].Features.properties);
                                delete masters.Groups[i].Collections[j].Masters[k].Features.properties;
                                masters.Groups[i].Collections[j].Masters[k].Features.properties = {};
                                for (feature in Features) {
                                    if (Features.hasOwnProperty(feature)) {
                                        //feature = angular.copy(Features[feature]);
                                        masters.Groups[i].Collections[j].Masters[k].Features.properties[_.camelCase(Features[feature].title)] = Features[feature];
                                        //delete Features[feature];
                                    }
                                }
                            }
                        }
                    }
                    window.console.log(JSON.stringify(masters));
                });
            };
        load('data/masters.json');
        return {
            "select": function (master) {
                masterSelected = master;
            },
            "getSelected": function () {
                return masterSelected;
            },
            "add": function (master, masterToReplace) {
                var group, collection, collectionOfReplacedMaster;
                if (masterToReplace) {
                    collectionOfReplacedMaster = findGroup(masters, masterToReplace.groupName).findCollection(group.Collections, masterToReplace.collectionName);
                    collectionOfReplacedMaster.splice(collectionOfReplacedMaster.indexOf(masterToReplace), 1);
                }
                if (!master.groupName) {
                    master.groupName = "General";
                }
                group = findGroup(masters, master.groupName);
                if (!group) {
                    masters.push({
                        "name": master.groupName
                    });
                    group = masters.Groups[masters.Groups.length - 1];
                }
                if (!master.collectionName) {
                    master.collectionName = "General";
                }
                collection = findCollection(group.Collections, master.collectionName);
                if (!collection) {
                    group.Collections.push({
                        "name": master.collectionName
                    });
                    collection = masters.Collections[masters.Collections.length - 1];
                }
                collection.Masters.push(master);
            },
            "get": function () {
                return masters;
            },
            "check": function () {
                window.alert(JSON.stringify(masters));
            }
        };
    }]);

    // define controller for masters
    angular.module('TheApp').controller('mastersController', ['$scope', 'mastersService', 'propertiesService', function ($scope, mastersService, propertiesService) {

        this.masters = mastersService;

        this.properties = propertiesService;

        this.selectMaster = function (master) {
            // track selected master
            mastersService.select(master);

            // show features of master
            propertiesService.set(master.Features);
        };

    }]);

}(window.angular));
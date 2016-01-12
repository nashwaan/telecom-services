// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('mastersService', ['$http', function ($http) {
        var masters = null,
            masterSelected = null,
            masterEdit = null,
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
            addParentNames = function () {
                var i, j, k, master;
                for (i = 0; i < masters.Groups.length; i += 1) {
                    for (j = 0; j < masters.Groups[i].Collections.length; j += 1) {
                        for (k = 0; k < masters.Groups[i].Collections[j].Masters.length; k += 1) {
                            master = masters.Groups[i].Collections[j].Masters[k];
                            master.groupName = masters.Groups[i].name;
                            master.collectionName = masters.Groups[i].Collections[j].name;
                        }
                    }
                }
            },
            removeParentNames = function () {
                var i, j, k, master;
                for (i = 0; i < masters.Groups.length; i += 1) {
                    for (j = 0; j < masters.Groups[i].Collections.length; j += 1) {
                        for (k = 0; k < masters.Groups[i].Collections[j].Masters.length; k += 1) {
                            delete masters.Groups[i].Collections[j].Masters[k].groupName;
                            delete masters.Groups[i].Collections[j].Masters[k].collectionName;
                        }
                    }
                }
            },
            getMasterFromPath = function (masterFullPath) {
                var i, j, k, master, masterPath = masterFullPath.split(">");
                for (i = 0; i < masters.Groups.length; i += 1) {
                    if (masters.Groups[i].name === masterPath[0]) {
                        for (j = 0; j < masters.Groups[i].Collections.length; j += 1) {
                            if (masters.Groups[i].Collections[j].name === masterPath[1]) {
                                for (k = 0; k < masters.Groups[i].Collections[j].Masters.length; k += 1) {
                                    if (masters.Groups[i].Collections[j].Masters[k].name === masterPath[2]) {
                                        return masters.Groups[i].Collections[j].Masters[k];
                                    }
                                }
                                return null;
                            }
                        }
                    }
                }
            },
            load = function (path) {
                $http.get(path).success(function (data) {
                    masters = data;
                    addParentNames();
                    window.console.log("Masters data was retrieved successfully.");
                    /*window.console.log(JSON.stringify(masters));*/
                });
            };
        load('data/masters.json');
        return {
            "select": function (groupName, collectionName, master) {
                masterSelected = angular.copy(master);
                masterSelected.groupName = groupName;
                masterSelected.collectionName = collectionName;
                masterSelected.reference = master;
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
            "getMasterFromPath": function (masterFullPath) {
                return getMasterFromPath(masterFullPath);
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
    angular.module('TheApp').controller('mastersController', ['mastersService', 'propertiesService', 'navigationService', function (mastersService, propertiesService, navigationService) {
        var self = this;
        self.isDocked = function (componentId) {
            return navigationService.isSidenavLocked(componentId);
        };
        self.getGroups = function () {
            return mastersService.get().Groups;
        };
        self.selectMaster = function (groupName, collectionName, master) {
            // track selected master
            mastersService.select(groupName, collectionName, master);
            // show attributes of master
            propertiesService.manage(master.Attributes);
        };
    }]);

}(window.angular));
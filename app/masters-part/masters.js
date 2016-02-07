// silence JSLint error: variable used before it was defined
/*global angular*/
/*global console*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('mastersService', ['$http', function ($http) {
        var masters = null,
            masterSelected = null,
            masterEdit = null;

        function findGroup(masters, groupName) {
            var i, group;
            if (masters && masters.Groups) {
                for (i = 0; i < masters.Groups.length; i += 1) {
                    if (masters.Groups[i].name === groupName) {
                        group = masters.Groups[i];
                        break;
                    }
                }
            }
            return group;
        }

        function findCollection(group, collectionName) {
            var i, collection;
            if (group && group.Collections) {
                for (i = 0; i < group.Collections.length; i += 1) {
                    if (group.Collections[i].name === collectionName) {
                        collection = group.Collections[i];
                        break;
                    }
                }
            }
            return collection;
        }

        function findMaster(collection, masterName) {
            var i, master;
            if (collection && collection.Masters) {
                for (i = 0; i < collection.Masters.length; i += 1) {
                    if (collection.Masters[i].name === masterName) {
                        master = collection.Masters[i];
                        break;
                    }
                }
            }
            return master;
        }

        function deleteMaster(master) {
            var group, collection, i;
            group = findGroup(masters, master.groupName);
            collection = findCollection(group, master.collectionName);
            if (collection) {
                for (i = 0; i < collection.Masters.length; i += 1) {
                    if (collection.Masters[i].name === master.name) {
                        collection.Masters.splice(i, 1);
                        return i;
                    }
                }
            }
        }

        function addParentNames(masters) {
            masters.Groups.forEach(function (group) {
                group.Collections.forEach(function (collection) {
                    collection.Masters.forEach(function (master) {
                        angular.forEach(master.Attributes.properties, function (property, key) {
                            if (property.mandatory) {
                                delete property.mandatory;
                            }
                        })
                    })
                })
            });
            //console.log(JSON.stringify(masters));
        }

        function removeParentNames(masters) {
            var i, j, k, master;
            for (i = 0; i < masters.Groups.length; i += 1) {
                for (j = 0; j < masters.Groups[i].Collections.length; j += 1) {
                    for (k = 0; k < masters.Groups[i].Collections[j].Masters.length; k += 1) {
                        delete masters.Groups[i].Collections[j].Masters[k].groupName;
                        delete masters.Groups[i].Collections[j].Masters[k].collectionName;
                    }
                }
            }
        }

        function getMasterFromPath(masterFullPath) {
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
        }

        function load(path) {
            $http.get(path).then(function (response) {
                masters = response.data;
                addParentNames(masters);
                console.log("Masters data was retrieved successfully.");
            }, function (response) {
                console.warn("Could not load masters data." + response.status);
            });
        }

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
                var insertIndex, group, collection;
                if (masterToReplace) {
                    insertIndex = deleteMaster(masterToReplace);
                }
                if (!master.groupName) {
                    master.groupName = "General";
                }
                if (!masters.Groups) {
                    masters.Groups = [];
                }
                group = findGroup(masters, master.groupName);
                if (!group) {
                    masters.Groups.push({
                        "name": master.groupName
                    });
                    group = masters.Groups[masters.Groups.length - 1];
                }
                if (!master.collectionName) {
                    master.collectionName = "General";
                }
                if (!group.Collections) {
                    group.Collections = [];
                }
                collection = findCollection(group, master.collectionName);
                if (!collection) {
                    group.Collections.push({
                        "name": master.collectionName
                    });
                    collection = group.Collections[group.Collections.length - 1];
                }
                if (!collection.Masters) {
                    collection.Masters = [];
                }
                if (isNaN(insertIndex)) {
                    collection.Masters.push(master);
                } else {
                    collection.Masters.splice(insertIndex, 0, master);
                }
            },
            "remove": function (master) {
                deleteMaster(master);
            },
            "getMasterFromPath": function (masterFullPath) {
                return getMasterFromPath(masterFullPath);
            },
            "get": function () {
                return masters;
            },
            "check": function () {
                console.warn(JSON.stringify(masters));
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
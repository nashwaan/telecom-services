// silence JSLint error: variable used before it was defined
/*global angular*/
/*global console*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('mastersService', ['$http', function ($http) {
        var masters,
            masterSelected,
            masterEdit;

        function getItem(holder, itemsName, itemName, createMissing) {
            var i, item;
            if (holder) {
                if (!holder[itemsName] && createMissing) {
                    holder[itemsName] = [];
                }
                if (holder[itemsName]) {
                    for (i = 0; i < holder[itemsName].length; i += 1) {
                        if (holder[itemsName][i].name === itemName) {
                            item = holder[itemsName][i];
                            break;
                        }
                    }
                }
                if (!item && createMissing) {
                    holder[itemsName].push({
                        "name": itemName
                    });
                    item = holder[itemsName][holder[itemsName].length - 1];
                }
            }
            return item;
        }

        function deleteMaster(master) {
            var group, collection, i;
            group = getItem(masters, "Groups", master.groupName);
            collection = getItem(group, "Collections", master.collectionName);
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
                        master.groupName = group.name;
                        master.collectionName = collection.name;
                    });
                });
            });
            //delete removeParentNames(masters); console.log(JSON.stringify(masters));
        }

        function removeParentNames(masters) {
            masters.Groups.forEach(function (group) {
                group.Collections.forEach(function (collection) {
                    collection.Masters.forEach(function (master) {
                        delete master.groupName;
                        delete master.collectionName;
                    });
                });
            });
        }

        function getMasterFromPath(masterPath) {
            var group, collection, master;
            if (masterPath[0]) {
                group = getItem(masters, "Groups", masterPath[0]);
                if (masterPath[1]) {
                    collection = getItem(group, "Collections", masterPath[1]);
                    if (masterPath[2]) {
                        master = getItem(collection, "Masters", masterPath[2]);
                    }
                }
            }
            return master;
        }

        (function load(path) {
            $http.get(path).then(function (response) {
                masters = response.data;
                addParentNames(masters);
                console.log("Masters data was retrieved successfully.");
            }, function (response) {
                console.warn("Could not load masters data." + response.status);
            });
        }('data/masters.json'));

        return {
            "get": function () {
                return masters;
            },
            "getMasterFromPath": function (masterPath) {
                return getMasterFromPath(masterPath);
            },
            "getSelected": function () {
                return masterSelected;
            },
            "select": function (groupName, collectionName, master) {
                masterSelected = angular.copy(master);
                masterSelected.groupName = groupName;
                masterSelected.collectionName = collectionName;
            },
            "add": function (master, masterToReplace) {
                var insertIndex, group, collection;
                if (masterToReplace) {
                    insertIndex = deleteMaster(masterToReplace);
                }
                if (!master.groupName) {
                    master.groupName = "General";
                }
                group = getItem(masters, "Groups", master.groupName, true);
                if (!master.collectionName) {
                    master.collectionName = "General";
                }
                collection = getItem(group, "Collections", master.collectionName, true);
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
                if (masterEdit === master) {
                    masterEdit = undefined;
                }
                if (masterSelected === master) {
                    masterSelected = undefined;
                }
                deleteMaster(master);
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
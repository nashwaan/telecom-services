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

        function makeHierarchy(mastersGiven) {
            var masters = {}, m, i, j, r;
            mastersGiven.forEach(function (master) {
                 for (r = master.revisions.length - 1; r >=0; r -= 1) {
                    if (master.revisions[r].show === true) {
                       if (!masters.Groups) {
                            masters.Groups = [];
                        }
                        for (i = 0; i < masters.Groups.length; i += 1) {
                            if (masters.Groups[i].name === master.groupName) {
                                break;
                            }
                        }
                        if (i === masters.Groups.length) {
                            masters.Groups.push({name: master.groupName});
                            i = masters.Groups.length - 1;
                        }
                        if (!masters.Groups[i].Collections) {
                            masters.Groups[i].Collections = [];
                        }
                        for (j = 0; j < masters.Groups[i].Collections.length; j += 1) {
                            if (masters.Groups[i].Collections[j].name === master.collectionName) {
                                break;
                            }
                        }
                        if (j === masters.Groups[i].Collections.length) {
                            masters.Groups[i].Collections.push({name: master.collectionName});
                            j = masters.Groups[i].Collections.length - 1;
                        }
                        if (!masters.Groups[i].Collections[j].Masters) {
                            masters.Groups[i].Collections[j].Masters = [];
                        }
                        m = {};
                        m.name = master.name;
                        m.collectionName = master.collectionName;
                        m.groupName = master.groupName;
                        angular.forEach(master.revisions[r], function(val, key) {
                            m[key] = val;
                        });
                        masters.Groups[i].Collections[j].Masters.push(m);
                        break;
                    }
                }
            });
            return masters;
        }
        
        /*function addParentNames(masters) {
            var mas = [], m, rev;
            masters.Groups.forEach(function (group) {
                group.Collections.forEach(function (collection) {
                    collection.Masters.forEach(function (master) {
                        m = {};
                        m.name = master.name;
                        m.collectionName = collection.name;
                        m.groupName = group.name;
                        m.revisions = [];
                        rev = {};
                        rev.ver = 1;
                        rev.by = 'yalmarzooqi';
                        rev.when = '2016-03-22T11:11:11.111Z';
                        rev.description = master.description || '';
                        rev.icon = master.icon || '';
                        rev.value = master.value;
                        rev.kind = master.kind;
                        rev.show = true;
                        rev.Attributes = {};
                        rev.Attributes.schema = angular.copy(master.Attributes.$schema);
                        delete master.Attributes.$schema;
                        angular.forEach(master.Attributes, function (val, key) {
                            rev.Attributes[key] = val;
                        });
                        m.revisions.push(rev);
                        mas.push(m);
                    });
                });
            });
            console.log(JSON.stringify(mas));
            //removeParentNames(masters); console.log(JSON.stringify(masters));
        }*/

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

        /*(function load(path) {
            $http.get(path).then(function (response) {
                masters = response.data;
                addParentNames(masters);
                console.log("Masters data was retrieved successfully.");
            }, function (response) {
                console.warn("Could not load masters data." + response.status);
            });
        }('data/masters.json'));*/
        (function load(path) {
            $http.get(path).then(function (response) {
                masters = makeHierarchy(response.data);
                console.log("Masters data was retrieved successfully.");
            }, function (response) {
                console.warn("Could not load masters data." + response.status);
            });
        }('api/masters'));

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
            return mastersService.get() ? mastersService.get().Groups : null;
        };
        self.selectMaster = function (groupName, collectionName, master) {
            // track selected master
            mastersService.select(groupName, collectionName, master);
            // show attributes of master
            propertiesService.manage(master.Attributes);
        };
    }]);

}(window.angular));
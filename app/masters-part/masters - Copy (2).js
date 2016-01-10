// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    //
    angular.module('TheApp').factory('mastersService', ['$http', '$q', function ($http, $q) {

        var masters = null,
            masterEdit,
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
                    /*var i, j, k, master, f, Features;
                    for (i = 0; i < masters.Groups.length; i += 1) {
                        for (j = 0; j < masters.Groups[i].Collections.length; j += 1) {
                            for (k = 0; k < masters.Groups[i].Collections[j].Masters.length; k += 1) {
                                master = masters.Groups[i].Collections[j].Masters[k];
                                Features = angular.copy(master.Features);
                                delete master.Features;
                                master.Features = {
                                    "$schema": "http://json-schema.org/draft-04/schema#",
                                    "title": "Features",
                                    "description": "Features of '" + masters.Groups[i].Collections[j].Masters[k].name + "'",
                                    "type": "object",
                                    "properties": {}
                                };
                                for (f = 0; f < Features.length; f += 1) {
                                    master.Features.properties["Feature" + (f + 1)] = Features[f];
                                }
                            }
                        }
                    }
                    window.console.log(JSON.stringify(masters));*/
                });
            };
        load('data/masters.json');
        return {
            "edit": function (master) {
                masterEdit = master;
            },
            "add": function (master) {
                var group = findGroup(master.Group);
                if (group === null) {
                    group = findGroup("General");
                    if (group === null) {
                        masters.push({
                            "Group": "General"
                        });
                    }
                }
                masters.push(master);
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

        this.showMasterFeatures = function (master) {
//            var masterShow = angular.copy(master);
//            masterShow.properties = masterShow.Features;
//            delete masterShow.Features;
//            masterShow.type = "object";
            propertiesService.set(master.Features);
        };

    }]);

}(window.angular));
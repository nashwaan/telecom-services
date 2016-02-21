// silence JSLint error: variable used before it was defined
/*global angular*/
/*global console*/


(function (angular) {
    'use strict';

    angular.module('TheApp').factory('plansService', ['$http', function ($http) {
        var plans,
            planEdit,
            planSelected,
            gridOptions,
            agGridData;

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

        function deletePlan(plan) {
            var level1, level2, level3, i;
            level1 = getItem(plans, "Level1", plan.level1Name);
            level2 = getItem(level1, "Level2", plan.level2Name);
            level3 = getItem(level2, "Level3", plan.level3Name);
            for (i = 0; i < level3.Plans.length; i += 1) {
                if (level3.Plans[i].name === plan.name) {
                    level3.Plans.splice(i, 1);
                    return i;
                }
            }
        }

        function getPlanFromPath(planFullPath) {
            var level1, level2, level3, plan, planPath = planFullPath.split(">");
            if (planPath[0]) {
                level1 = getItem(plans, "Level1", planPath[0]);
                if (planPath[1]) {
                    level2 = getItem(level1, "Level2", planPath[1]);
                    if (planPath[2]) {
                        level3 = getItem(level2, "Level3", planPath[2]);
                        if (planPath[3]) {
                            plan = getItem(level3, "Plans", planPath[3]);
                        }
                    }
                }
            }
            return plan;
        }

        function toAgGridNested(obj) {
            var result = [],
                sourceIsArray = false;
            if (obj instanceof Array) {
                obj = {
                    "array": obj
                };
                sourceIsArray = true;
            }
            (function iterate(obj, result, level) {
                var i, key, node = {
                    "data": {}
                };
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (obj[key] instanceof Array) {
                            if (key !== "Features") {
                                node.group = true;
                                node.expanded = level <= 4 ? true : false;
                                node.children = [];
                                for (i = 0; i < obj[key].length; i += 1) {
                                    iterate(obj[key][i], node.children, level + 1);
                                }
                            }
                        } else {
                            node.data[key] = obj[key];
                        }
                    }
                }
                node.data.level = level - 1;
                result.push(node);
            }(obj, result, 1));
            if (sourceIsArray) {
                result = result[0].children;
            }
            return result;
        }

        function load(path) {
            $http.get(path).then(function (response) {
                plans = response.data;
                agGridData = toAgGridNested(plans.Level1);
                console.log("Plans data was retrieved successfully.");
            }, function (response) {
                console.warn("Could not load plans data." + response.status);
            });
        }

        load('data/plans.json');

        return {
            "get": function () {
                return plans;
            },
            "getTitle": function () {
                return plans ? plans.name : "Plans";
            },
            "getAgGrid": function () {
                return agGridData;
            },
            "setRows": function (gridOptions) {
                $http.get('data/plans.json').then(function (response) {
                    gridOptions.api.setRowData(agGridData);
                }, function (response) {});
            },
            "getSelected": function () {
                return planSelected;
            },
            "select": function (planPath) {
                var plan = getPlanFromPath(planPath);
                if (plan) {
                    planSelected = angular.copy(plan);
                    planSelected.level1Name = planPath.split(">")[0];
                    planSelected.level2Name = planPath.split(">")[1];
                    planSelected.level3Name = planPath.split(">")[2];
                }
            },
            "add": function (plan, planToReplace) {
                var insertIndex, level1, level2, level3;
                if (planToReplace) {
                    insertIndex = deletePlan(planToReplace);
                }
                if (!plan.Level1Name) {
                    plan.Level1Name = "General Level1";
                }
                level1 = getItem(plans, "Level1", plan.Level1Name, true);
                if (!plan.Level2Name) {
                    plan.Level2Name = "General Level2";
                }
                level2 = getItem(level1, "Level2", plan.Level2Name, true);
                if (!plan.Level3Name) {
                    plan.Level3Name = "General Level3";
                }
                level3 = getItem(level2, "Level3", plan.Level3Name, true);
                if (!level3.Plans) {
                    level3.Plans = [];
                }
                if (isNaN(insertIndex)) {
                    level3.Plans.push(plan);
                } else {
                    level3.Plans.splice(insertIndex, 0, plan);
                }
            },
            "remove": function (plan) {
                if (planEdit === plan) {
                    planEdit = undefined;
                }
                if (planSelected === plan) {
                    planSelected = undefined;
                }
                deletePlan(plan);
            }
        };
    }]);

    // define controller for plans
    angular.module('TheApp').controller('plansController', ['$scope', '$http', 'plansService', 'navigationService', function ($scope, $http, plansService, navigationService) {
        var self = this;
        self.isDocked = function (componentId) {
            return navigationService.isSidenavLocked(componentId);
        };
    }]);

    angular.module('TheApp').controller('plansController2', ['$scope', '$http', '$document', 'plansService', 'navigationService', function ($scope, $http, $document, plansService, navigationService) {
        $scope.selectedPlan = 'Select a file below...';

        function getNodePath(node) {
            var path = node.data.name;
            while (node.parent) {
                path = node.parent.data.name + ">" + path;
                node = node.parent;
            }
            return path;
        }

        function rowClicked(params) {
            console.log(JSON.stringify(params.node.data));
            if (params.node.data.level === 4) {
                plansService.select(getNodePath(params.node));
            }
            $scope.selectedPlan = params.node.data.name;
        }

        function innerCellRenderer(params) {
            var icon;
            switch (params.node.data.level) {
            case 1:
            case 2:
            case 3:
                icon = '<path style="fill:#ffc72c" d="m5.5058 1.9893c-0.22526 0-0.40667 0.18133-0.40667 0.40659v14.58c0 0.22526 0.18141 0.40658 0.40667 0.40658h12.323c0.22526 0 0.40658-0.18133 0.40658-0.40658v-14.58c0-0.22526-0.18133-0.40659-0.40658-0.40659z"/>' + '<path style="fill:#ffdb4c" d="m5.3648 2.1073 7.2607 3.5734c0.15488 0.076224 0.27894 0.32646 0.27894 0.56007v14.463c0 0.23362-0.12399 0.36135-0.27894 0.2833l-7.2612-3.658c-0.1549-0.078-0.2789-0.326-0.2789-0.56v-14.379c0-0.23362 0.12406-0.35952 0.27894-0.2833z"/>';
                break;
            case 4:
                icon = '<path style="fill:#ffffff" d="m5.9566 2.1294v16.374h11.873v-13.182l-3.1627-3.1921h-0.08224z"/>' + '<path style="fill:#587a72" d="m5.73 1.9027v16.842h12.326v-13.559l-3.2834-3.2834h-0.08538-8.9574zm0.4091 0.4091h8.2708v3.1892h3.2372v12.835h-11.508v-16.024zm8.6799 0.21522 2.5613 2.5631h-2.5613v-2.5631z"/>' + '<path style="fill:#587a72" d="m5.73 1.9027v16.842h12.326v-13.559l-3.2834-3.2834h-0.08538-8.9574zm0.4091 0.4091h8.2708v3.1892h3.2372v12.835h-11.508v-16.024zm8.6799 0.21522 2.5613 2.5631h-2.5613v-2.5631z"/>';
                break;
            case 5:
                icon = '<path style="fill:#587a72" d="m 4.7324219,5.265625 0,0.2890625 0,12.8222655 14.3574221,0 0,-13.111328 z m 0.5742187,2.4066804 13.2070314,0 0,10.1304286 -13.2070314,0 z" />';
                break;
            case 6:
                icon = '<path style="fill:#587a72" d="m 8.1392016,5.265625 0,0.2890625 0,12.8222655 7.5438624,0 0,-13.111328 z m 0.6067981,0.7795618 6.3800883,0 0,11.7575472 -6.3800883,0 z" />';
                break;
            default:
                icon = '<path style="fill:#587a72" r="6.4449153" cy="12" cx="12" />';
            }
            icon = '<svg style="width:24px;height:24px;vertical-align:middle">' + icon + '</svg> ';
            return icon + ' <span title="' + params.data.description + '">' + params.data.name + '</span>';
        }
        var self = this,
            columnDefs = [
                {
                    headerName: "Name",
                    field: "name",
                    width: 250,
                    cellRenderer: {
                        renderer: 'group',
                        innerRenderer: innerCellRenderer
                    }
                },
                {
                    headerName: "Level",
                    field: "level",
                    width: 50,
                    cellStyle: {
                        'text-align': 'left'
                    }
                }
            ];
        self.gridOptions = {
            columnDefs: columnDefs,
            rowSelection: 'multiple',
            rowsAlreadyGrouped: true,
            enableColResize: true,
            enableSorting: true,
            rowHeight: 20,
            rowStyle: [{
                color: 'red'
            }],
            icons: {
                groupContracted: '<i style="display:inline-block;width:10px;font-weight:bold">+</i>',
                groupExpanded: '<i style="display:inline-block;width:10px;font-weight:bold">−</i>'
            },
            onRowClicked: rowClicked
        };
        $document.ready(function () {
            console.log("document.ready()");
            plansService.setRows(self.gridOptions);
        });
        self.getTitle = function () {
            return plansService.getTitle();
        };

    }]);

}(window.angular));
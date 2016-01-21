// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    angular.module('TheApp').factory('plansService', ['$http', function ($http) {
        var plans = null,
            agGridData = null;
        function toAgGridNested(obj) {
            var result = [], sourceIsArray = false;
            if (obj instanceof Array) {
                obj = {"array": obj};
                sourceIsArray = true;
            }
            (function iterate(obj, result, level) {
                var key, node = {"data": {}}, i;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (obj[key] instanceof Array) {
                            if (key !== "Features") {
                                node.group = true;
                                node.expanded = true;
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
            "load": function (path, gridOptions) {
                $http.get(path).success(function (data) {
                    plans = data;
                    window.console.log("Plans data was retrieved successfully.");
                    agGridData = toAgGridNested(plans.Level1);
                    window.console.log(JSON.stringify(agGridData));
                    gridOptions.api.setRowData(agGridData);
                });
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

    angular.module('TheApp').controller('plansController2', ['$scope', '$http', 'plansService', 'navigationService', function ($scope, $http, plansService, navigationService) {
        $scope.selectedPlan = 'Select a file below...';
        function rowClicked(params) {
            $scope.selectedPlan = params.nod.data.name;
        }
        function innerCellRenderer(params) {
            var icon;
            if (params.node.group) {
                icon = '<path style="fill:#ffc72c" d="m5.5058 1.9893c-0.22526 0-0.40667 0.18133-0.40667 0.40659v14.58c0 0.22526 0.18141 0.40658 0.40667 0.40658h12.323c0.22526 0 0.40658-0.18133 0.40658-0.40658v-14.58c0-0.22526-0.18133-0.40659-0.40658-0.40659z"/>'
                     + '<path style="fill:#ffdb4c" d="m5.3648 2.1073 7.2607 3.5734c0.15488 0.076224 0.27894 0.32646 0.27894 0.56007v14.463c0 0.23362-0.12399 0.36135-0.27894 0.2833l-7.2612-3.658c-0.1549-0.078-0.2789-0.326-0.2789-0.56v-14.379c0-0.23362 0.12406-0.35952 0.27894-0.2833z"/>';
            } else {
                icon = '<path style="fill:#ffffff" d="m5.9566 2.1294v16.374h11.873v-13.182l-3.1627-3.1921h-0.08224z"/>'
                     + '<path style="fill:#587a72" d="m5.73 1.9027v16.842h12.326v-13.559l-3.2834-3.2834h-0.08538-8.9574zm0.4091 0.4091h8.2708v3.1892h3.2372v12.835h-11.508v-16.024zm8.6799 0.21522 2.5613 2.5631h-2.5613v-2.5631z"/>'
                     + '<path style="fill:#587a72" d="m5.73 1.9027v16.842h12.326v-13.559l-3.2834-3.2834h-0.08538-8.9574zm0.4091 0.4091h8.2708v3.1892h3.2372v12.835h-11.508v-16.024zm8.6799 0.21522 2.5613 2.5631h-2.5613v-2.5631z"/>';
            }
            icon = '<svg style="width:24px;height:24px;vertical-align:middle">' + icon + '</svg> ';
            return icon + ' <span title="' + params.data.description + '">' + params.data.name + '</span>';
        }
        var self = this,
            columnDefs = [
                {headerName: "Name", field: "name", width: 250,
                    cellRenderer: {
                        renderer: 'group',
                        innerRenderer: innerCellRenderer
                    }},
                {headerName: "Level", field: "level", width: 50, cellStyle: {'text-align': 'left'}}
            ];
        self.gridOptions = {
            columnDefs: columnDefs,
            rowSelection: 'multiple',
            rowsAlreadyGrouped: true,
            enableColResize: true,
            enableSorting: true,
            rowHeight: 20,
            rowStyle: [{color: 'red'}],
            icons: {
                groupContracted: '<i style="display:inline-block;width:10px;font-weight:bold">+</i>',
                groupExpanded: '<i style="display:inline-block;width:10px;font-weight:bold">−</i>'
            },
            onRowClicked: rowClicked
        };
        plansService.load("data/plans.json", self.gridOptions);
        self.getTitle = function () {
            return plansService.getTitle();
        };

    }]);
    
}(window.angular));
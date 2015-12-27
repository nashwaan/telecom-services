// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for canvas
    angular.module('TheApp').controller('canvasController', ['$scope', '$http', '$mdBottomSheet', '$log', function ($scope, $http, $mdBottomSheet, $log) {

        $scope.dropIntoComponent = function (event, index, item, external, type, allowedType) {
            /*$scope.logListEvent('dropped at', event, index, external, type);
            if (external) {
                if (allowedType === 'itemType' && !item.label) return false;
                if (allowedType === 'containerType' && !angular.isArray(item)) return false;
            }*/
            $log.debug(JSON.stringify(event));
            $log.debug(JSON.stringify(index));
            $log.debug(JSON.stringify(item));
            $log.debug(JSON.stringify(type));
            
            return item;
        };
        
        //
        $scope.selected = {
            band: null,
            component: null,
            property: null,
            attributte: null
        };

        //  
        $http.get('data/plan-A.json').success(function (data) {

            $scope.plan = data;

            window.console.log("Plan data was loaded successfully.");

        });

        $scope.$watch('plan', function (plan) {
            $scope.planAsJson = angular.toJson(plan, true);
        }, true);

        // Show the bottom sheet  
        this.showActions = function ($event) {
            var user = $scope.selected;

            // Bottom Sheet controller  
            function ContactPanelController($mdBottomSheet) {
                this.user = user;
                this.submitContact = function (action) {
                    $mdBottomSheet.hide(action);
                };
            }

            return $mdBottomSheet.show({
                parent: angular.element(document.getElementById('content')),
                templateUrl: 'actions-part/actions-view.html',
                controller: ['$mdBottomSheet', ContactPanelController],
                controllerAs: 'cp',
                bindToController: true,
                targetEvent: $event
            }).then(function (clickedItem) {
                //clickedItem && $log.debug(clickedItem.name + ' clicked!');
            });

        };

        // IMPORTANT: Items should be placed in the grid in the order in which they should appear.
        // In most cases the sorting should be by row ASC, col ASC

        // these map directly to gridsterItem directive options
        $scope.standardItems = [{
            sizeX: 2,
            sizeY: 1,
            row: 0,
            col: 0
        }, {
            sizeX: 1,
            sizeY: 1,
            row: 0,
            col: 4
        }, {
            row: 3,
            col: 4
        }];

        $scope.gridsterOpts = {
            columns: 10, // the width of the grid, in columns
            pushing: true, // whether to push other items out of the way on move or resize
            floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
            swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
            width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
            rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
            margins: [10, 10], // the pixel distance between each widget
            outerMargin: true, // whether margins apply to outer edges of the grid
            isMobile: false, // stacks the grid items if true
            mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
            mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
            minColumns: 1, // the minimum columns the grid must have
            minRows: 2, // the minimum height of the grid, in rows
            maxRows: 100,
            defaultSizeX: 2, // the default width of a gridster item, if not specifed
            defaultSizeY: 1, // the default height of a gridster item, if not specified
            minSizeX: 1, // minimum column width of an item
            maxSizeX: null, // maximum column width of an item
            minSizeY: 1, // minumum row height of an item
            maxSizeY: null, // maximum row height of an item
            resizable: {
                enabled: true,
                handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                start: function (event, $element, widget) {}, // optional callback fired when resize is started,
                resize: function (event, $element, widget) {}, // optional callback fired when item is resized,
                stop: function (event, $element, widget) {} // optional callback fired when item is finished resizing
            },
            draggable: {
                enabled: true, // whether dragging items is supported
                handle: 'p', // optional selector for resize handle
                start: function (event, $element, widget) {}, // optional callback fired when drag is started,
                drag: function (event, $element, widget) {}, // optional callback fired when item is moved,
                stop: function (event, $element, widget) {} // optional callback fired when item is finished dragging
            }
        };

    }]);

}(window.angular));
// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for assemble
    angular.module('TheApp').controller('assembleController', ['$rootScope', '$scope', '$http', '$mdBottomSheet', '$log', function ($rootScope, $scope, $http, $mdBottomSheet, $log) {

        $rootScope.selected = {
            item: null,
            type: undefined
        };

        $scope.showSettings = function (element, type) {
            $rootScope.selected = {
                item: element,
                type: type
            };
        };
        
        $scope.display = {
            attributes: false
        };

        $scope.dropIntoComponent = function (event, index, item, external, type, allowedType) {
            /*$scope.logListEvent('dropped at', event, index, external, type);
            if (external) {
                if (allowedType === 'itemType' && !item.label) return false;
                if (allowedType === 'containerType' && !angular.isArray(item)) return false;
            }*/
            /*$log.debug(JSON.stringify(event));
            $log.debug(JSON.stringify(index));
            $log.debug(JSON.stringify(item));
            $log.debug(JSON.stringify(external));
            $log.debug(JSON.stringify(type));
            $log.debug(JSON.stringify(allowedType));*/

            return item;
        };

        //  
        $http.get('data/plan-A.json').success(function (data) {

            $rootScope.plan = data;

            window.console.log("Plan data was loaded successfully.");

        });

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

    }]);

}(window.angular));
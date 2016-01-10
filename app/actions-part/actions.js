// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for actions
    angular.module('TheApp').controller('actionsController', ['$scope', '$mdSidenav', '$mdBottomSheet', '$q', function ($scope, $mdSidenav, $mdBottomSheet, $q) {

        this.toggleSidenav = function (componentId) {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function () {
                $mdSidenav(componentId).toggle();
            });
        };

        $scope.$on('$locationChangeStart', function (e, nextURL, currentURL) {
            $scope.page = nextURL.split('/').splice(-1);
            $scope.styleUrl = 'demo/' + $scope.page + '/style.css';
        });

        /*// Show the bottom sheet  
        this.showActions = function ($event) {
            var user = "$scope.selected";
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
        };*/

    }]);

}(window.angular));
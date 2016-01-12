// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for navigation
    angular.module('TheApp').factory('navigationService', [function () {
        var lockedSidenav = {
            'masters': true,
            'properties': true
        };
        return {
            "toggleSidenavLock": function (componentId) {
                lockedSidenav[componentId] = !lockedSidenav[componentId];
            },
            "isSidenavLocked": function (componentId) {
                return lockedSidenav[componentId];
            }
        };
    }]);

    // define controller for navigation
    angular.module('TheApp').controller('navigationController', ['navigationService', '$scope', '$mdSidenav', '$mdBottomSheet', '$q', '$mdMedia', '$location', function (navigationService, $scope, $mdSidenav, $mdBottomSheet, $q, $mdMedia, $location) {
        var self = this;
        self.toggleSidenav = function (componentId) {
            if ($mdMedia('sm')) {
                var pending = $mdBottomSheet.hide() || $q.when(true);
                pending.then(function () {
                    $mdSidenav(componentId).toggle();
                });
            } else {
                navigationService.toggleSidenavLock(componentId);
            }
        };
        self.isOpenSidenav = function (componentId) {
            return $mdSidenav(componentId).isOpen();
        };
        $scope.$on('$locationChangeStart', function (e, nextURL, currentURL) {
            $scope.page = nextURL.split('/').splice(-1);
            $scope.styleUrl = 'demo/' + $scope.page + '/style.css';
        });
        self.changeMode = function () {
            $location.path($location.path() === '/assemble' ? 'manufacture' : 'assemble');
        };
    }]);

}(window.angular));
// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for navigation
    angular.module('TheApp').factory('navigationService', ['manufactureService', 'assembleService', '$location', function (manufactureService, assembleService, $location) {
        var lockedSidenav = {
            "plans": false,
            "masters": true,
            "properties": true
        };
        return {
            "getTitle": function () {
                var active;
                switch ($location.path()) {
                case '/manufacture':
                    active = manufactureService.getMasterEdit();
                    return active ? active.name : "Manufacture Mode";
                case '/assemble':
                    active = assembleService.getPlan();
                    return active ? active.name : "Design Mode";
                default:
                    return "Telecom Designer";
                }
            },
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
        var self = this,
            thisYear = new Date().getFullYear();
        self.check = function () {
            window.alert(self.getTitle());
        };
        self.getTitle = function () {
            return navigationService.getTitle();
        };
        self.toggleSidenav = function (componentId) {
            if ($mdMedia('gt-sm') && componentId === "properties") {
                navigationService.toggleSidenavLock(componentId);
            } else if ($mdMedia('gt-md')) {
                navigationService.toggleSidenavLock(componentId);
            } else {
                var pending = $mdBottomSheet.hide() || $q.when(true);
                pending.then(function () {
                    $mdSidenav(componentId).toggle();
                });
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
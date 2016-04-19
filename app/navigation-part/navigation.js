// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for navigation
    angular.module('TheApp').factory('navigationService', ['manufactureService', 'assembleService', '$location', function (manufactureService, assembleService, $location) {
        var busy = false,
            lockedSidenav = {
                "plans": true,
                "masters": false,
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
                    active = assembleService.getPlanEdit();
                    return active ? active.name : "Design Mode";
                case '/international':
                    active = assembleService.getPlanEdit();
                    return active ? active.name : "World Map";
                default:
                    return "Telecom Designer";
                }
            },
            "toggleSidenavLock": function (componentId) {
                lockedSidenav[componentId] = !lockedSidenav[componentId];
            },
            "isSidenavLocked": function (componentId) {
                return lockedSidenav[componentId];
            },
            "showBusy": function (toggle) {
                busy = toggle;
            },
            "isBusy": function () {
                return busy;
            }
        };
    }]);

    // define controller for navigation
    angular.module('TheApp').controller('navigationController', ['navigationService', 'loginService', '$scope', '$mdSidenav', '$mdBottomSheet', '$q', '$mdMedia', '$location', '$mdDialog', function (navigationService, loginService, $scope, $mdSidenav, $mdBottomSheet, $q, $mdMedia, $location, $mdDialog) {
        var self = this;
        self.getUserName = function () {
            return loginService.getName();
        };
        self.getUserRole = function () {
            return loginService.getRole();
        };
        self.getTitle = function () {
            return navigationService.getTitle();
        };
        self.findCreatedPlans = function (ev) {
        };
        self.findEditedPlans = function (ev) {
        };
        self.logout = function (ev) {
            loginService.logout();
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
            var paths = ['manufacture', 'assemble', 'international'],
                index = paths.indexOf($location.path().substring(1));
            $location.path(paths[(index + 1) % paths.length]);
        };
        self.isBusy = function () {
            return navigationService.isBusy();
        };
        $scope.rowsPerPage = 100;
        self.showSettings = function (ev) {
            $mdDialog.show({
                controller: function ($scope, $mdDialog, rowsPerPage) {
                    $scope.rowsPerPage = rowsPerPage;
                    $scope.ok = function(settings) {
                        $mdDialog.hide(settings);
                    };
                    $scope.cancel = function() {
                        $mdDialog.hide();
                    };
                },
                templateUrl: 'user-settings.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { rowsPerPage: $scope.rowsPerPage },
                /*preserveScope: true,*/
                clickOutsideToClose: true,
                fullscreen: $mdMedia('sm')
            }).then(function (settings) {
                $scope.rowsPerPage = settings.rowsPerPage;
                console.log('Dialog closed with "' + settings + '".');
            }, function () {
                console.log('Dialog closed.');
            });
        };
    }]);

}(window.angular));
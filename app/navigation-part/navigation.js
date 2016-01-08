// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for navigation
    angular.module('TheApp').controller('navigationController', ['$scope', '$mdSidenav', '$mdBottomSheet', '$q', '$mdMedia', '$location', function ($scope, $mdSidenav, $mdBottomSheet, $q, $mdMedia, $location) {

        $scope.lockSidenavLeft = false;
        $scope.lockSidenavRight = true;
        
        this.toggleSidenav = function (componentId) {
            var pending = $mdBottomSheet.hide() || $q.when(true);
            pending.then(function () {
                $mdSidenav(componentId).toggle();
            });
        };

        this.isOpenSidenav = function (componentId) {
            return $mdSidenav(componentId).isOpen();
        };

        $scope.$on('$locationChangeStart', function (e, nextURL, currentURL) {
            $scope.page = nextURL.split('/').splice(-1);
            $scope.styleUrl = 'demo/' + $scope.page + '/style.css';
        });

        this.changeMode = function () {
            $location.path($location.path() === '/assemble' ? 'manufacture' : 'assemble');
        };

    }]);

}(window.angular));
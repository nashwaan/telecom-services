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

    }]);

}(window.angular));
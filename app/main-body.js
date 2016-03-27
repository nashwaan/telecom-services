// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for app, schemasService is injected here for early initialization
    angular.module('TheApp').controller('mainController', ['$rootScope', '$http', 'loginService', function ($rootScope, $http, loginService) {
        var self = this;
        $rootScope.selected = {
            "item": null,
            "type": ""
        };
        self.isAuthenticated = function() {
            return loginService.isAuthenticated();
        };
    }]);

}(window.angular));
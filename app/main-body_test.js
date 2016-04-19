// silence JSLint error: variable used before it was defined
/*global describe,it,expect,beforeEach,angular*/

describe('Testing main-body.js:', function () {
    'use strict';

    beforeEach(angular.mock.module('TheApp'));

    describe('mainController:', function () {
        
        var mainController, $rootScope, loginService;
        beforeEach(angular.mock.inject(function ($injector, $controller) {
            $rootScope = $injector.get('$rootScope');
            loginService = $injector.get('loginService');
            mainController = $controller('mainController', {
                $rootScope: $rootScope,
                loginService: loginService
            });
        }));
        
        it('should initialize "selected" to null', function () {
            expect($rootScope.selected).toEqual({"item": null, "type": ""});
        });
        
        xit('should check initial authentication status', function () {
            expect(mainController.isAuthenticated()).toBeFalsy();
        });
        
    });
    
});
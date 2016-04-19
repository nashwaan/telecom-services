// silence JSLint error: variable used before it was defined
/*global describe,it,expect,beforeEach,angular*/

describe('Testing login.js:', function () {
    'use strict';
    
    beforeEach(angular.mock.module('TheApp'));
    
    describe('USER_ROLES enum:', function () {
        
        it('should provide different role names', function () {
            var USER_ROLES;
            angular.mock.inject(function ($injector) {
                USER_ROLES = $injector.get('USER_ROLES');
            });
            expect(USER_ROLES.all).toBe('*');
            expect(USER_ROLES.admin).toBe('admin');
            expect(USER_ROLES.editor).toBe('editor');
            expect(USER_ROLES.guest).toBe('guest');
        });
        
    });
    
    var loginService, $rootScope, $httpBackend;
    beforeEach(angular.mock.inject(function ($injector) {
        loginService = $injector.get('loginService');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        //console.log(angular.toJson($rootScope));
        $httpBackend.when('POST', '/auth/logout').respond({});
        $httpBackend.when('POST', '/auth/login', {username: 'New Staff', password: 'secret'}).respond({
            "email": "staff@example.com",
            "fullname": "Mr Staff",
            "role": "admin"
        });
        $httpBackend.when('POST', '/auth/login').respond(401, {});
    }));

    describe('loginService:', function () {
        
        it('should be initialized properly', function () {
            expect(loginService).toBeDefined();
            expect(loginService.getEmail()).toBeFalsy(); // toBeNull();
            expect(loginService.getName()).toBeFalsy(); // toBeNull();
            expect(loginService.getRole()).toBeFalsy(); // toBeNull();
            expect(loginService.isAuthenticated()).toBeFalsy();
        });
        
        it('should not allow to login with incorrect credentials', function () {
            $httpBackend.expect('POST', '/auth/login', {});
            loginService.login({});
            $httpBackend.flush(1);
            expect(loginService.getEmail()).toBeNull();
            expect(loginService.getName()).toBeNull();
            expect(loginService.getRole()).toBeNull();
            expect(loginService.isAuthenticated()).toBeFalsy();
            $httpBackend.expect('POST', '/auth/login', {});
            loginService.login({});
            $httpBackend.flush(1);
            expect(loginService.isAuthenticated()).toBeFalsy();
            $httpBackend.expect('POST', '/auth/login', {username: 'New Staff', password: 'random'});
            loginService.login({username: 'New Staff', password: 'random'});
            $httpBackend.flush(1);
            expect(loginService.isAuthenticated()).toBeFalsy();
            $httpBackend.expect('POST', '/auth/login', {username: 'Random Staff', password: 'secret'});
            loginService.login({username: 'Random Staff', password: 'secret'});
            $httpBackend.flush(1);
            expect(loginService.isAuthenticated()).toBeFalsy();
        });
        
        it('should allow to login with correct credentials', function () {
            $httpBackend.expect('POST', '/auth/login', {username: 'New Staff', password: 'secret'});
            loginService.login({username: 'New Staff', password: 'secret'});
            $httpBackend.flush(1);
            expect(loginService.getEmail()).toBe('staff@example.com');
            expect(loginService.getName()).toBe('Mr Staff');
            expect(loginService.getRole()).toBe('admin');
            expect(loginService.isAuthenticated()).toBeTruthy();
        });
        
        it('should logout properly', function () {
            $httpBackend.expect('POST', '/auth/logout', {});
            loginService.logout();
            $httpBackend.flush(1);
            expect(loginService.getEmail()).toBeNull();
            expect(loginService.getName()).toBeNull();
            expect(loginService.getRole()).toBeNull();
            expect(loginService.isAuthenticated()).toBeFalsy();
        });
        
    });

    describe('loginController:', function () {
        
        var loginController;
        beforeEach(angular.mock.inject(function ($injector, $controller) {
            loginController = $controller('loginController', {
                loginService: loginService
            });
        }));
        
        it('should track login status', function () {
            expect(loginController.isLoggedIn()).toBeFalsy();
        });
        
        it('should have initial username and password', function () {
            expect(loginController.username).toBe('Yousuf');
            expect(loginController.password).toBe('hola');
        });
        
        it('should return current year', function () {
            expect(loginController.getYear()).toBe(2016);
        });
        
        it('should login a user', function () {
            $httpBackend.expect('POST', '/auth/login', {username: 'Non-Existing Staff', password: 'secret'});
            loginController.login('Non-Existing Staff', 'secret');
            $httpBackend.flush(1);
            expect(loginController.isLoggedIn()).toBeFalsy();
            $httpBackend.expect('POST', '/auth/login', {username: 'New Staff', password: 'secret'});
            loginController.login('New Staff', 'secret');
            $httpBackend.flush(1);
            expect(loginController.isLoggedIn()).toBeTruthy();
        });
        
    });
    
});
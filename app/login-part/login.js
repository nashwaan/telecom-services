// silence JSLint error: variable used before it was defined
/*global angular*/
/*global io*/
/*global console*/


(function (angular) {
    'use strict';

    angular.module('TheApp').constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        editor: 'editor',
        guest: 'guest'
    });
    
    angular.module('TheApp').config(['$httpProvider', function($httpProvider) {
        
        $httpProvider.interceptors.push(['$rootScope', '$q', function ($rootScope, $q) {
            return {
                "request": function(config) {
                    return config;
                },
                "requestError": function(rejection) {
                    //if (canRecover(rejection)) { return responseOrNewPromise }
                    return $q.reject(rejection);
                },
                "response": function(response) {
                    return response;
                },
                "responseError": function(rejection) {
                    if (rejection.status === 401) {
                        console.log("rejection: ", rejection);
                        var deferred = $q.defer();
                        $rootScope.requests401.push({"config": rejection.config, "deferred": deferred});
                        $rootScope.$broadcast('event:loginRequired');
                        return deferred.promise;
                    } else {
                        return $q.reject(rejection);
                    }
                }
            };
        }]);
        
    }]);
    
    angular.module('TheApp').factory('loginService', ['$rootScope', '$http', function ($rootScope, $http) {
        var email, name, role;
        var socket = io(); // io() with no args does auto-discovery
        $rootScope.requests401 = [];

        function resetLogin() {
            email = null;
            name = null;
            role = null;            
        }
        
        function retryUnauthorizedRequests () {
            var i;
            for (i = 0; i < $rootScope.requests401.length; i++) {
                (function (req) {
                    $http(req.config).then(function(response) {
                        req.deferred.resolve(response);
                    });
                }($rootScope.requests401[i]));
            }
            $rootScope.requests401 = [];
        }

        $rootScope.$on('event:loginRequired', function () {
            resetLogin();
        });
        
        socket.on('connect', function () {
            console.info('Connected to server via socket.io');
        });
        socket.on('error', function (reason) {
            console.error('Unable to connect socket.io', reason);
        });
        socket.on('logout', function () {
            $rootScope.$apply(function () {
                resetLogin();
            });
            console.info('Instructed by server to logout');
        });
        
        return {
            "getEmail": function() {
                return email;
            },
            "getName": function() {
                return name;
            },
            "getRole": function() {
                return role;
            },
            "login": function (credentials) {
                //return $http.post('auth/login', "username=" + encodeURIComponent(credentials.username) + "&password=" + encodeURIComponent(credentials.password), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(
                //return $http.post('auth/login', $httpParamSerializer(credentials), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(
                return $http.post('/auth/login', credentials).then(
                    function (response) {
                        socket.emit('join', response.data.email.split('@')[0]);
                        retryUnauthorizedRequests();
                        email = response.data.email;
                        name = response.data.fullname;
                        role = response.data.role;
                        return response.data;
                    }, function(reason) {
                        resetLogin();
                    });
                },
            "logout": function () {
                resetLogin();
                return $http.post('/auth/logout', {});
            },
            "isAuthenticated": function () {
                return !!name;
            },
            "isAuthorized": function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                //return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
                return true;
            }
        };
    }]);

    angular.module('TheApp').controller('loginController', ['loginService', function (loginService) {
        var self = this;
        self.isLoggedIn = function() {
            return loginService.isAuthenticated();
        };
        self.username = 'Yousuf';
        self.password = 'hola';
        self.login = function (username, password) {
            loginService.login({username: username, password: password});
        };
        self.logout = function () {
            loginService.logout();
        };
        self.getYear = function() {
            return new Date().getFullYear();
        };
    }]);

}(window.angular));
// silence JSLint error: variable used before it was defined
/*global describe,it,expect,beforeEach,angular*/

describe('Testing app.js:', function () {
    'use strict';

    var module = angular.module('TheApp');
    it('should be registered', function () {
        expect(module).not.toEqual(null);
    });

    describe('Dependencies:', function () {
        var dependencies = module.value('TheApp').requires;
        console.log(dependencies);
        it('should have ngRoute as a dependency', function () {
            expect(dependencies.indexOf('ngRoute') >= 0).toEqual(true);
        });
        it('should have ngMessages as a dependency', function () {
            expect(dependencies.indexOf('ngMessages') >= 0).toEqual(true);
        });
        it('should have ngMaterial as a dependency', function () {
            expect(dependencies.indexOf('ngMaterial') >= 0).toEqual(true);
        });
        it('should have ui.router as a dependency', function () {
            expect(dependencies.indexOf('ui.router') >= 0).toEqual(true);
        });
        it('should have dndLists as a dependency', function () {
            expect(dependencies.indexOf('dndLists') >= 0).toEqual(true);
        });
        it('should have agGrid as a dependency', function () {
            expect(dependencies.indexOf('agGrid') >= 0).toEqual(true);
        });
    });

    describe('config block:', function () {
        /*var routeProvider, messenger;
        beforeEach(function () {
            angular.mock.module(function ($provide, $routeProvider) {
                routeProvider = $routeProvider;
                spyOn(routeProvider, 'when').andCallThrough();
                spyOn(routeProvider, 'otherwise').andCallThrough();
                messenger = {
                    send: jasmine.createSpy('send')
                };
                $provide.value('messenger', messenger);
            });
        });
        it('should have called registered 3 routes', function () {
            // Otherwise internally calls when. So, call count of when has to be 4
            expect(routeProvider.when.callCount).toBe(4);
        });
        it('should have registered a default route', function () {
            expect(routeProvider.otherwise).toHaveBeenCalled();
        });*/
    });

});
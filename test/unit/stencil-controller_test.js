// silence JSLint error: variable used before it was defined
/*global describe,it,expect,beforeEach,module,inject,$httpBackend*/

describe('Unit testing Telecom Services app', function () {
    'use strict';

//    it('should do basic test', function () {
//        expect('Hello ' + "World!").toBe('Hello World!');
//    });

    describe('Stencil controller', function () {
        var scope, ctrl, $httpBackend;

        beforeEach(module('servicesDesignerApp'));
        
        
        
        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service in order to avoid a name conflict.
        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
            
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('data/properties-attributes.json').respond([{
                name: 'Property 1'
            }, {
                name: 'Property 2'
            }]);

            scope = $rootScope.$new();
            ctrl = $controller('stencilController', {
                $scope: scope
            });
            
            $httpBackend.flush();
        }));

        it('should create "stencil" model with 2 masters fetched from XHR', function () {
            
            expect(scope.stencil.masters).toEqual([{
                name: 'Property 1'
            }, {
                name: 'Property 2'
            }]);
            
        });


        it('should create "stencil" model with 2 masters', function () {
            expect(scope.stencil.masters.length).toBe(2);
        });

        it('should set the default value of stencil.selectedMaster as null', function () {
            expect(scope.stencil.selectedMaster).toEqual(null);
        });

    });

});

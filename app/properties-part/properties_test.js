// silence JSLint error: variable used before it was defined
/*global describe,it,expect,beforeEach,angular*/

describe('Testing properties.js:', function () {
    'use strict';
    
    beforeEach(angular.mock.module('TheApp'));
    
    var propertiesService;
    beforeEach(angular.mock.inject(function ($injector) {
        propertiesService = $injector.get('propertiesService');
    }));

    describe('propertiesService:', function () {
        
        it('should be initialized disabled', function () {
            expect(propertiesService.isDisabled()).toBeFalsy();
        });
                
    });

    describe('propertiesController:', function () {
        
        var propertiesService, propertiesController;
        beforeEach(angular.mock.inject(function ($injector, $controller) {
            propertiesService = $injector.get('propertiesService');
            propertiesController = $controller('propertiesController', {
                propertiesService: propertiesService
            });
        }));
        
        it('should convert object to JSON formatted string', function () {
            expect(propertiesController.jsonToText({})).toEqual('{}');
            expect(propertiesController.jsonToText(["apple", "orange"])).toEqual('["apple","orange"]');
            expect(propertiesController.jsonToText({"name": "hi"})).toEqual('{"name":"hi"}');
        });
        
    });
    
});
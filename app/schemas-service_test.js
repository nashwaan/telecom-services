// silence JSLint error: variable used before it was defined
/*global describe,it,expect,beforeEach,angular*/

describe('Testing schemas-service.js:', function () {
    'use strict';

    beforeEach(angular.mock.module('TheApp'));
    
    var schemasService, $httpBackend;
    beforeEach(angular.mock.inject(function ($injector) {
        schemasService = $injector.get('schemasService');
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', 'data/master-icons.json').respond(["Account", "Add-on", "BasePlan"]);
        $httpBackend.when('GET', 'api/schemas').respond([
            {
                "name": "master",
                "fresh": {"name": ""},
                "schema": {"title": "Master"}
            }
        ]);
    }));

    describe('schemasService:', function () {
        it('should load master-icons', function () {
            $httpBackend.expect('GET', 'data/master-icons.json');
            $httpBackend.flush();
            expect(schemasService.masterIcons()).toEqual(["Account", "Add-on", "BasePlan"]);
        });
        it('should provide schema for an object', function () {
            $httpBackend.expect('GET', 'api/schemas');
            $httpBackend.flush();
            expect(schemasService.schema('master')).toEqual({"title": "Master"});
        });
        it('should provide fresh instance for an object', function () {
            $httpBackend.expect('GET', 'api/schemas');
            $httpBackend.flush();
            expect(schemasService.fresh('master')).toEqual({"name": ""});
        });
    });

});
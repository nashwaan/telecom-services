// silence JSLint error: variable used before it was defined
/*global describe,it,expect,beforeEach,angular*/

describe('Testing filters.js:', function () {
    'use strict';

    beforeEach(angular.mock.module('TheApp'));
    
    describe('icon_file filter:', function () {
        it('icon_file filter prepends "icon" to input', angular.mock.inject(function($filter) {
            expect($filter('icon_file')).not.toBeNull();
            expect($filter('icon_file')(null)).toEqual('icon');
            expect($filter('icon_file')('device')).toEqual('icondevice');
            expect($filter('icon_file')('device', true)).toEqual('iconDEVICE');
        }));
    });
    
    describe('icon_provider filter:', function () {
        it('icon_provider filter prepends "generic" to input', angular.mock.inject(function($filter) {
            expect($filter('icon_provider')).not.toBeNull();
            expect($filter('icon_provider')(null)).toEqual('master:generic');
            expect($filter('icon_provider')('device')).toEqual('master:device');
        }));
    });

});
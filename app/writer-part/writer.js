// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for writer
    angular.module('TheApp').controller('writerController', ['assembleService', function (assembleService) {

        //
        this.check = function () {
            window.alert("CHECK:\n" + JSON.stringify(assembleService.getPlanEdit().name));
        };
        this.getPlan = function () {
            return assembleService.getPlanEdit();
        };
        this.getMasterName = function (feature) {
            return feature.masterPath[2];
        };
        this.getTotalAttributes = function (feature) {
            var key, count = 0;
            for (key in feature) {
                if (feature.hasOwnProperty(key)) {
                    count += 1;
                }
            }
            return count;
        };

    }]);

}(window.angular));
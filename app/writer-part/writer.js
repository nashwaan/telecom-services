// silence JSLint error: variable used before it was defined
/*global angular*/
/*global console*/


(function (angular) {
    'use strict';

    angular.module('TheApp').factory('writerService', ['$http', function ($http) {
        var template;

        JSZipUtils.getBinaryContent('data/brd.docx', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            try {
                var zip = new JSZip(data);
                console.log(err);
                console.log("" + data);
                console.log(zip.file("[Content_Types].xml").asText());
            } catch (e) {
                console.log(e);
            }
        });

        return {
            "generate": function () {
                return null;
            }
        };
    }]);

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
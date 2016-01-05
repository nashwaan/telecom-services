// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // define controller for settings
    angular.module('TheApp').controller('settingsController', ['$rootScope', '$scope', '$http', 'mastersService', function ($rootScope, $scope, $http, mastersService) {

        function transformSchema() {

        }
        
        //  
        $http.get('data/test-settings.json').success(function (data) {

            $scope.schema = data;
            
            window.console.log("Settings data was loaded successfully.");

        });

        //
        $scope.property = {
            "inputData": {
                "Nature": "STD",
                "FreebeesAmount": 100,
                "UnitPulse": "Per Second"
            },
            "inputSchema": $scope.schema
        };

    }]);

}(window.angular));
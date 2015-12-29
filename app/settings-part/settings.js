// silence JSLint error: variable used before it was defined
/*global angular*/
/*global properties_attributes*/


(function (angular) {
    'use strict';

    // define controller for settings
    angular.module('TheApp').controller('settingsController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

//        $scope.selected = {
//            item: $rootScope.item,
//            type: $rootScope.type
//        };

        //  
        $http.get('data/masters.json').success(function (data) {

            $scope.panel = {
                selectedSetting: null,
                settings: data
            };

            window.console.log("Settings data was loaded successfully.");

        });

    }]);

}(window.angular));
// silence JSLint error: variable used before it was defined
/*global angular*/
/*global properties_attributes*/


(function (angular) {
    'use strict';


    // define controller for 'servicesDesignerApp'
    angular.module('servicesDesignerApp').controller('stencilController', ['$scope', '$http', function ($scope, $http) {

        //  
        $http.get('data/properties-attributes.json').success(function (data) {

            $scope.stencil = {
                selectedMaster: null,
                masters: data
            };

            $scope.masters = data;

            window.console.log("properties data was retrieved successfully.");

        });

    }]);

}(window.angular));
// silence JSLint error: variable used before it was defined
/*global angular*/
/*global console*/


(function (angular) {
    'use strict';

    angular.module('TheApp').factory('internationalService', ['$http', function ($http) {
        var countries;

        function load(path) {
            $http.get(path).then(function (response) {
                countries = response.data;
                console.log("Countries data was retrieved successfully.");
            }, function (response) {
                console.warn("Could not load countries data." + response.status);
            });
        }

        load("data/countries.json");

        return {
            "get": function () {
                return countries;
            }
        };
    }]);

    angular.module('TheApp').directive('svgMap', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            templateUrl: 'icons/world-map.svg',
            link: function (scope, element, attrs) {
                var countries = element[0].querySelectorAll('.country');
                angular.forEach(countries, function (path, key) {
                    var countryElement = angular.element(path);
                    countryElement.attr("country", "");
                    countryElement.attr("dummy-data", "getCountries");
                    countryElement.attr("hover-country", "hoverCountry");
                    $compile(countryElement)(scope);
                });
            }
        };
    }]);

    angular.module('TheApp').directive('country', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                getCountries: "=",
                hoverCountry: "="
            },
            link: function (scope, element, attrs) {
                scope.elementId = element.attr("id");
                element.attr("ng-mouseover", "countryMouseOver()");
                scope.countryMouseOver = function () {
                    scope.hoverCountry = scope.elementId;
                    element[0].parentNode.appendChild(element[0]);
                };
                element.attr("ng-click", "countryClick()");
                scope.countryClick = function () {
                    window.alert(scope.getCountries()[scope.elementId].value);
                };
                element.attr("ng-class", "{active:hoverCountry===elementId}");
                element.removeAttr("country");
                $compile(element)(scope);
            }
        };
    }]);

    angular.module('TheApp').controller('internationalController', ['internationalService', '$scope', function (internationalService, $scope) {
        $scope.getCountries = function () {
            return internationalService.get();
        };
        $scope.changeHoverCountry = function (country) {
            $scope.hoverCountry = country;
        };
    }]);

}(window.angular));
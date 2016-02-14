// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // initialize 'servicesDesignerApp' module
    angular.module('TheApp', ['ngRoute',
                              'ngMessages',
                              'ngMaterial',
                              'ngMdIcons',
                              'gridster',
                              'dndLists',
                              'agGrid'])
        .config(['$routeProvider', '$locationProvider', '$mdThemingProvider', '$mdIconProvider', function ($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {

            //
            $routeProvider
                .when('/assemble', {
                    templateUrl: 'assemble-part/assemble.html'
                })
                .when('/manufacture', {
                    templateUrl: 'manufacture-part/manufacture.html'
                })
                .when('/international', {
                    templateUrl: 'international-part/international.html'
                })
                .otherwise({
                    redirectTo: '/assemble'
                });

            // use the HTML5 History API to avoid '#' in the URL
            //$locationProvider.html5Mode(true);

            /*jslint bitwise: true*/

            function rgbToHex(r, g, b) {
                return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            }

            function shadeColor(color, percent) {
                var f = parseInt(color.slice(1), 16),
                    t = percent < 0 ? 0 : 255,
                    p = percent < 0 ? percent * -1 : percent,
                    R = f >> 16,
                    G = f >> 8 & 0x00FF,
                    B = f & 0x0000FF;
                return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
            }

            function blendColors(c0, c1, p) {
                var f = parseInt(c0.slice(1), 16),
                    t = parseInt(c1.slice(1), 16),
                    R1 = f >> 16,
                    G1 = f >> 8 & 0x00FF,
                    B1 = f & 0x0000FF,
                    R2 = t >> 16,
                    G2 = t >> 8 & 0x00FF,
                    B2 = t & 0x0000FF;
                return "#" + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1);
            }

            /*jslint bitwise: false*/

            var primaryColor = "#84b478",
                accentColor = "#fce2c7";
            $mdThemingProvider.definePalette('etisalatGreenPalette', {
                '50': shadeColor(primaryColor, 0.80),
                '100': shadeColor(primaryColor, 0.60),
                '200': shadeColor(primaryColor, 0.40),
                '300': shadeColor(primaryColor, 0.20),
                '400': shadeColor(primaryColor, 0.0),
                '500': shadeColor(primaryColor, -0.20),
                '600': shadeColor(primaryColor, -0.40),
                '700': shadeColor(primaryColor, -0.55),
                '800': shadeColor(primaryColor, -0.70),
                '900': shadeColor(primaryColor, -0.85),
                'A100': shadeColor(primaryColor, 0.40),
                'A200': shadeColor(primaryColor, 0.0),
                'A400': shadeColor(primaryColor, -0.40),
                'A700': shadeColor(primaryColor, -0.70),
                'contrastDefaultColor': 'light', //  whether text (contrast) on this palette should be dark or light
                'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
                'contrastLightColors': ['500', '600', '700', '800', '900', 'A400', 'A700']
            });
            $mdThemingProvider.definePalette('etisalatGreyPalette', {
                '50': shadeColor(accentColor, 0.80),
                '100': shadeColor(accentColor, 0.60),
                '200': shadeColor(accentColor, 0.40),
                '300': shadeColor(accentColor, 0.20),
                '400': shadeColor(accentColor, 0.0),
                '500': shadeColor(accentColor, -0.20),
                '600': shadeColor(accentColor, -0.40),
                '700': shadeColor(accentColor, -0.55),
                '800': shadeColor(accentColor, -0.70),
                '900': shadeColor(accentColor, -0.85),
                'A100': shadeColor(accentColor, 0.40),
                'A200': shadeColor(accentColor, 0.0),
                'A400': shadeColor(accentColor, -0.40),
                'A700': shadeColor(accentColor, -0.70),
                'contrastDefaultColor': 'dark', //  whether text (contrast) on this palette should be dark or light
                'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
                'contrastLightColors': ['500', '600', '700', '800', '900', 'A400', 'A700']
            });

            // configure the default theme
            $mdThemingProvider.theme('default')
                .primaryPalette('etisalatGreenPalette')
                .accentPalette('etisalatGreyPalette');
            //  .backgroundPalette('')
            //  .warnPalette('');

            // configure 'etisalat-dark' theme
            $mdThemingProvider.theme('etisalat-dark', 'default')
                .primaryPalette('orange')
                .dark();

            // set default size of md-icon
            $mdIconProvider.defaultViewBoxSize(40);

            // configure URLs for icons specified by [set:]id.
            $mdIconProvider
                .iconSet('gui', 'icons/gui-icons.svg')
                .iconSet('$default', 'icons/master-icons.svg')
                .icon('logo', 'icons/logo.svg');

        }])
        .run(function ($log) {
            $log.debug("TheApp with its dependecies is loaded and running...");
        });

    // define controller for app, schemasService is injected here for early initialization
    angular.module('TheApp').controller('selectController', ['$rootScope', 'schemasService', function ($rootScope, schemasService) {
        $rootScope.selected = {
            "item": null,
            "type": ""
        };
    }]);

}(window.angular));
// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // initialize 'servicesDesignerApp' module
    angular.module('TheApp', ['ngRoute',
                              'ngMaterial',
                              'gridster',
                              'dndLists',
                              'etsDraggableDirective',
                              'etsFilters'])
        .config(['$routeProvider', '$locationProvider', '$mdThemingProvider', '$mdIconProvider', function ($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {

            //
            $routeProvider
                .when('/assemble', {
                    templateUrl: 'assemble-part/assemble.html'
                })
                .when('/manufacture', {
                    templateUrl: 'manufacture-part/manufacture.html'
                })
                .otherwise({
                    redirectTo: '/manufacture'
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

            var primaryColor = blendColors("#BED308", "#719E19", 0.5),
                accentColor = "#878881";
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

            // Configure URLs for icons specified by [set:]id.
            $mdIconProvider
                .icon('logo', 'icons/logo.svg')
                .icon('menu', 'icons/menu.svg')
                .icon('share', 'icons/share.svg')
                .icon('Property:Account', 'icons/property/Account.svg')
                .icon('Property:Add-on', 'icons/property/Add-on.svg')
                .icon('Property:BasePlan', 'icons/property/BasePlan.svg')
                .icon('Property:Bundle', 'icons/property/Bundle.svg')
                .icon('Property:CallFreebees', 'icons/property/CallFreebees.svg')
                .icon('Property:CallTariff', 'icons/property/CallTariff.svg')
                .icon('Property:ChangeArrow', 'icons/property/ChangeArrow.svg')
                .icon('Property:ChangeFlavor', 'icons/property/ChangeFlavor.svg')
                .icon('Property:Charge', 'icons/property/Charge.svg')
                .icon('Property:Constraint', 'icons/property/Constraint.svg')
                .icon('Property:Contract', 'icons/property/Contract.svg')
                .icon('Property:Credit', 'icons/property/Credit.svg')
                .icon('Property:DataFreebees', 'icons/property/DataFreebees.svg')
                .icon('Property:DataTariff', 'icons/property/DataTariff.svg')
                .icon('Property:Device', 'icons/property/Device.svg')
                .icon('Property:DownArrow', 'icons/property/DownArrow.svg')
                .icon('Property:EndArrow', 'icons/property/EndArrow.svg')
                .icon('Property:File', 'icons/property/File.svg')
                .icon('Property:Info', 'icons/property/Info.svg')
                .icon('Property:Inquiry', 'icons/property/Inquiry.svg')
                .icon('Property:LeftArrow', 'icons/property/LeftArrow.svg')
                .icon('Property:MessageFreebees', 'icons/property/MessageFreebees.svg')
                .icon('Property:MessageTariff', 'icons/property/MessageTariff.svg')
                .icon('Property:Migrate', 'icons/property/Migrate.svg')
                .icon('Property:Migration', 'icons/property/Migration.svg')
                .icon('Property:Notification', 'icons/property/Notification.svg')
                .icon('Property:Project', 'icons/property/Project.svg')
                .icon('Property:Provisioning', 'icons/property/Provisioning.svg')
                .icon('Property:Report', 'icons/property/Report.svg')
                .icon('Property:Rewards', 'icons/property/Rewards.svg')
                .icon('Property:RightArrow', 'icons/property/RightArrow.svg')
                .icon('Property:SimCard', 'icons/property/SimCard.svg')
                .icon('Property:Square', 'icons/property/Square.svg')
                .icon('Property:SquareAim', 'icons/property/SquareAim.svg')
                .icon('Property:SquareDashed', 'icons/property/SquareDashed.svg')
                .icon('Property:Stakeholder', 'icons/property/Stakeholder.svg')
                .icon('Property:Subscribe', 'icons/property/Subscribe.svg')
                .icon('Property:Support', 'icons/property/Support.svg')
                .icon('Property:Unsubscribe', 'icons/property/Unsubscribe.svg')
                .icon('Property:UpArrow', 'icons/property/UpArrow.svg')
                .icon('Property:Xor', 'icons/property/Xor.svg');

        }])
        .run(function ($log) {
            $log.debug("TheApp with its dependecies is loaded and running...");
        });


}(window.angular));
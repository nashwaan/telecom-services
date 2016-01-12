// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    // initialize 'servicesDesignerApp' module
    angular.module('TheApp', ['ngRoute',
                              'ngMaterial',
                              'ngMdIcons',
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
                .icon('logo', 'icons/logo.svg')
                .icon('menu', 'icons/menu.svg')
                .icon('apps', 'icons/apps.svg')
                .icon('new', 'icons/new.svg')
                .icon('add', 'icons/add.svg')
                .icon('undo', 'icons/undo.svg')
                .icon('redo', 'icons/redo.svg')
                .icon('upload', 'icons/upload.svg')
                .icon('download', 'icons/download.svg')
                .icon('save', 'icons/save.svg')
                .icon('cut', 'icons/cut.svg')
                .icon('copy', 'icons/copy.svg')
                .icon('paste', 'icons/paste.svg')
                .icon('delete', 'icons/delete.svg')
                .icon('select', 'icons/select.svg')
                .icon('3dots', 'icons/3dots.svg')
                .icon('up', 'icons/up.svg')
                .icon('down', 'icons/down.svg')
                .icon('share', 'icons/share.svg')
                .icon('box', 'icons/box.svg')
                .icon('stand', 'icons/stand.svg')
                .icon('brick', 'icons/brick.svg')
                .icon('lines', 'icons/lines.svg')
                .icon('Master:Account', 'icons/property/Account.svg')
                .icon('Master:Add-on', 'icons/property/Add-on.svg')
                .icon('Master:BasePlan', 'icons/property/BasePlan.svg')
                .icon('Master:Bundle', 'icons/property/Bundle.svg')
                .icon('Master:CallFreebees', 'icons/property/CallFreebees.svg')
                .icon('Master:CallTariff', 'icons/property/CallTariff.svg')
                .icon('Master:ChangeArrow', 'icons/property/ChangeArrow.svg')
                .icon('Master:ChangeFlavor', 'icons/property/ChangeFlavor.svg')
                .icon('Master:Charge', 'icons/property/Charge.svg')
                .icon('Master:Constraint', 'icons/property/Constraint.svg')
                .icon('Master:Contract', 'icons/property/Contract.svg')
                .icon('Master:Credit', 'icons/property/Credit.svg')
                .icon('Master:DataFreebees', 'icons/property/DataFreebees.svg')
                .icon('Master:DataTariff', 'icons/property/DataTariff.svg')
                .icon('Master:Device', 'icons/property/Device.svg')
                .icon('Master:DownArrow', 'icons/property/DownArrow.svg')
                .icon('Master:EndArrow', 'icons/property/EndArrow.svg')
                .icon('Master:File', 'icons/property/File.svg')
                .icon('Master:Info', 'icons/property/Info.svg')
                .icon('Master:Inquiry', 'icons/property/Inquiry.svg')
                .icon('Master:LeftArrow', 'icons/property/LeftArrow.svg')
                .icon('Master:MessageFreebees', 'icons/property/MessageFreebees.svg')
                .icon('Master:MessageTariff', 'icons/property/MessageTariff.svg')
                .icon('Master:Migrate', 'icons/property/Migrate.svg')
                .icon('Master:Migration', 'icons/property/Migration.svg')
                .icon('Master:Notification', 'icons/property/Notification.svg')
                .icon('Master:Project', 'icons/property/Project.svg')
                .icon('Master:Provisioning', 'icons/property/Provisioning.svg')
                .icon('Master:Report', 'icons/property/Report.svg')
                .icon('Master:Rewards', 'icons/property/Rewards.svg')
                .icon('Master:RightArrow', 'icons/property/RightArrow.svg')
                .icon('Master:SimCard', 'icons/property/SimCard.svg')
                .icon('Master:Square', 'icons/property/Square.svg')
                .icon('Master:SquareAim', 'icons/property/SquareAim.svg')
                .icon('Master:SquareDashed', 'icons/property/SquareDashed.svg')
                .icon('Master:Stakeholder', 'icons/property/Stakeholder.svg')
                .icon('Master:Subscribe', 'icons/property/Subscribe.svg')
                .icon('Master:Support', 'icons/property/Support.svg')
                .icon('Master:Unsubscribe', 'icons/property/Unsubscribe.svg')
                .icon('Master:UpArrow', 'icons/property/UpArrow.svg')
                .icon('Master:Xor', 'icons/property/Xor.svg');

        }])
        .run(function ($log) {
            $log.debug("TheApp with its dependecies is loaded and running...");
        });

    // define controller for assemble
    angular.module('TheApp').controller('selectController', ['$rootScope', function ($rootScope) {
        $rootScope.selected = {
            "item": null,
            "type": ""
        };
    }]);

}(window.angular));
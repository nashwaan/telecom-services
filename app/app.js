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
        .config(['$routeProvider', '$mdThemingProvider', '$mdIconProvider', function ($routeProvider, $mdThemingProvider, $mdIconProvider) {

            //
            $routeProvider
                .when('/produce', {
                    templateUrl: 'canvas-part/canvas-view.html',
                    controller: 'canvasController'
                })
                .when('/manufacture', {
                    templateUrl: 'manufacture-part/manufacture-view.html',
                    controller: 'manufactureController'
                })
                .otherwise({
                    redirectTo: '/produce'
                });

            $mdThemingProvider.definePalette('amazingPaletteName', {
                '50': 'ffebee',
                '100': 'ffcdd2',
                '200': 'ef9a9a',
                '300': 'e57373',
                '400': 'ef5350',
                '500': 'f44336',
                '600': 'e53935',
                '700': 'd32f2f',
                '800': 'c62828',
                '900': 'b71c1c',
                'A100': 'ff8a80',
                'A200': 'ff5252',
                'A400': 'ff1744',
                'A700': 'd50000',
                // whether, by default, text (contrast)  on this palette should be dark or light
                'contrastDefaultColor': 'light',
                //hues which contrast should be 'dark' by default
                'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
                'contrastLightColors': undefined // could also specify this if default was 'dark'
            });

            //
            $mdThemingProvider.theme('default')
                .primaryPalette('lime')
                .accentPalette('brown');
//                .backgroundPalette('')
//                .warnPalette('');

            // Configure URLs for icons specified by [set:]id.
            $mdIconProvider
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
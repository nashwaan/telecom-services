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

            //
            $mdThemingProvider.theme('default')
                .primaryPalette('brown')
                .accentPalette('red');

            // Configure URLs for icons specified by [set:]id.
            $mdIconProvider
                .icon('menu', 'icons/menu.svg', 36)
                .icon('share', 'icons/share.svg', 36)
                .icon('Property:Account', 'icons/property/Account.svg', 36)
                .icon('Property:Add-on', 'icons/property/Add-on.svg', 36)
                .icon('Property:BasePlan', 'icons/property/BasePlan.svg', 36)
                .icon('Property:Bundle', 'icons/property/Bundle.svg', 36)
                .icon('Property:CallFreebees', 'icons/property/CallFreebees.svg', 36)
                .icon('Property:CallTariff', 'icons/property/CallTariff.svg', 36)
                .icon('Property:ChangeArrow', 'icons/property/ChangeArrow.svg', 36)
                .icon('Property:ChangeFlavor', 'icons/property/ChangeFlavor.svg', 36)
                .icon('Property:Charge', 'icons/property/Charge.svg', 36)
                .icon('Property:Constraint', 'icons/property/Constraint.svg', 36)
                .icon('Property:Contract', 'icons/property/Contract.svg', 36)
                .icon('Property:Credit', 'icons/property/Credit.svg', 36)
                .icon('Property:DataFreebees', 'icons/property/DataFreebees.svg', 36)
                .icon('Property:DataTariff', 'icons/property/DataTariff.svg', 36)
                .icon('Property:Device', 'icons/property/Device.svg', 36)
                .icon('Property:DownArrow', 'icons/property/DownArrow.svg', 36)
                .icon('Property:EndArrow', 'icons/property/EndArrow.svg', 36)
                .icon('Property:File', 'icons/property/File.svg', 36)
                .icon('Property:Info', 'icons/property/Info.svg', 36)
                .icon('Property:Inquiry', 'icons/property/Inquiry.svg', 36)
                .icon('Property:LeftArrow', 'icons/property/LeftArrow.svg', 36)
                .icon('Property:MessageFreebees', 'icons/property/MessageFreebees.svg', 36)
                .icon('Property:MessageTariff', 'icons/property/MessageTariff.svg', 36)
                .icon('Property:Migrate', 'icons/property/Migrate.svg', 36)
                .icon('Property:Migration', 'icons/property/Migration.svg', 36)
                .icon('Property:Notification', 'icons/property/Notification.svg', 36)
                .icon('Property:Project', 'icons/property/Project.svg', 36)
                .icon('Property:Provisioning', 'icons/property/Provisioning.svg', 36)
                .icon('Property:Report', 'icons/property/Report.svg', 36)
                .icon('Property:Rewards', 'icons/property/Rewards.svg', 36)
                .icon('Property:RightArrow', 'icons/property/RightArrow.svg', 36)
                .icon('Property:SimCard', 'icons/property/SimCard.svg', 36)
                .icon('Property:Square', 'icons/property/Square.svg', 36)
                .icon('Property:SquareAim', 'icons/property/SquareAim.svg', 36)
                .icon('Property:SquareDashed', 'icons/property/SquareDashed.svg', 36)
                .icon('Property:Stakeholder', 'icons/property/Stakeholder.svg', 36)
                .icon('Property:Subscribe', 'icons/property/Subscribe.svg', 36)
                .icon('Property:Support', 'icons/property/Support.svg', 36)
                .icon('Property:Unsubscribe', 'icons/property/Unsubscribe.svg', 36)
                .icon('Property:UpArrow', 'icons/property/UpArrow.svg', 36)
                .icon('Property:Xor', 'icons/property/Xor.svg', 36);

        }])
        .run(function ($log) {
            $log.debug("TheApp with its dependecies is loaded and running...");
        });


}(window.angular));
// silence JSLint error: variable used before it was defined
/*global angular*/

(function (angular) {
    'use strict';

    // initialize 'servicesDesignerApp' module
    angular.module('servicesDesignerApp', ['dndLists',
                    'etsDraggableDirective',
                    'etsFilters']).
    run(function ($log) {
        $log.debug("servicesDesignerApp + ngMaterial + dndLists + + + running...");
    });


}(window.angular));
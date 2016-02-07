// silence JSLint error: variable used before it was defined
/*global angular*/


(function (angular) {
    'use strict';

    //
    angular.module('etsDirectives', [])
        .directive('etsDraggable', ['$document', function ($document) {

            return {
                link: function (scope, element, attr) {
                    var startX = 0,
                        startY = 0,
                        x = 0,
                        y = 0;

                    function mousemove(event) {
                        y = event.pageY - startY;
                        x = event.pageX - startX;
                        element.css({
                            top: y + 'px',
                            left: x + 'px'
                        });
                    }

                    function mouseup() {
                        $document.off('mousemove', mousemove);
                        $document.off('mouseup', mouseup);
                    }

                    element.on('mousedown', function (event) {
                        // Prevent default dragging of selected content
                        event.preventDefault();
                        startX = event.pageX - x;
                        startY = event.pageY - y;
                        $document.on('mousemove', mousemove);
                        $document.on('mouseup', mouseup);
                    });

                    element.css({
                        position: 'relative',
                        border: '1px solid red',
                        backgroundColor: 'lightgrey',
                        cursor: 'pointer'
                    });

                }

            };
        }])
        .directive('elastic', ['$timeout', function ($timeout) {
                return {
                    restrict: 'A',
                    link: function ($scope, element) {
                        $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                        var resize = function () {
                            element[0].style.height = $scope.initialHeight;
                            element[0].style.height = "" + element[0].scrollHeight + "px";
                        };
                        //element.on("input change", resize);
                        element.on("blur keyup change", resize);
                        $timeout(resize, 0);
                    }
                };
            }
        ]);

}(window.angular));
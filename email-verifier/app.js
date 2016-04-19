(function (angular) {
    angular.module('TheApp', []).controller('verifierController', ['$scope', '$http', function ($scope, $http) {
        $scope.email = "";
        $scope.processing = false;
        $scope.validation = {};
        $scope.validateEmail = function (email) {
            console.log("verifying '" + email + "'");
            $scope.processing = true;
            $http.get('email/verify/' + email).then(function (response) {
                console.log("Email verification is completed.");
                $scope.validation = response.data;
                $scope.processing = false;
                console.dir(this.validation);
            }, function (response) {
                $scope.validation = {};
                $scope.processing = false;
                console.warn("Could not access email verification interface.", response);
            });
        };
    }]);
}(window.angular));
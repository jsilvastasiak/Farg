//angular.module("currentApp", []);

angular.module("currentApp").controller("titleCtrl", function ($scope, $http) {

    var getProfile = function (http) {
        return http.get('/getProfile');            
    };

    getProfile($http).then(function (res) {
        if (res)
            $scope.profile = res.data;
    });
});
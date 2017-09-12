angular.module("indexApp", []);

angular.module("indexApp").controller("titleCtrl", function ($scope, $http) {

    var getProfile = function (http) {
        return http.get('/getProfile');            
    };

    getProfile($http).then(function (res) {
        if (res)
            $scope.profile = res.data.profile;
    });
});
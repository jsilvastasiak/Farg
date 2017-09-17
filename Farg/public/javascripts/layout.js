//angular.module("LayoutApp", []);

angular.module("currentApp").controller("HelloCtrl", function ($scope) {
    $scope.message = "Olá";
});

angular.module("currentApp").controller("BtnPost", function ($scope, $http) {
    $scope.message = "Olá";

    $scope.BtnPost_Click = function () {
        $http.post('/', { message: $scope.message });
    }
});

/*.then(
    function (response) {
        console.log(response);
    },
    function (response) {
        console.log(response);
    }); */
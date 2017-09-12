angular.module("LayoutApp", []);

angular.module("LayoutApp").controller("HelloCtrl", function ($scope) {
    $scope.message = "Olá";
});

angular.module("LayoutApp").controller("BtnPost", function ($scope, $http) {
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
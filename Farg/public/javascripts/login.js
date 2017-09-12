angular.module("loginFormApp", []);

angular.module("loginFormApp").controller("frmLoginCtrl", function ($scope, $http) {

    $scope.doLogin = function (loginInfo) {
        $http.post('/login', {
            userName: loginInfo.userName.$modelValue,
            password: loginInfo.password.$modelValue
        }).then(function (res) {
            if (res) {
                if (typeof res.data.redirect == 'string')
                    window.location = res.data.redirect;
            }
        });
    }
});
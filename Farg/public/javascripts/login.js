//angular.module("loginFormApp", []);

angular.module("currentApp").controller("frmLoginCtrl", function ($scope, $http) {

    $scope.doLogin = function (loginInfo) {
        $http.post('/login', {
            userName: loginInfo.userName.$modelValue,
            password: loginInfo.password.$modelValue
        }).then(function (res) {
            if (res) {
                if (res.data.message) {
                    $scope.showMessageUser({
                        type: res.data.type,
                        message: res.data.message
                    });
                }
                else
                    if (typeof res.data.redirect == 'string')
                        window.location = res.data.redirect;
            }
        });
    }
});
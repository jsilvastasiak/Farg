angular.module("loginFormApp", ['ngAnimate', 'ui.bootstrap']);

angular.module("loginFormApp").controller("frmLoginCtrl", function ($scope, $http) {
    $scope._alerts = [];

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
    };

    $scope.setFormFocus = function (frm) {
        frm.$$element[0].focus();
    };

    $scope.showMessageUser = function (args) {
        $scope._alerts.push({
            typeMessageUser: args.type,
            messageUser: args.message,
            timeout: args.type === 'alert' ? 50000 : 2000
        });
    };

    $scope.closeMessageUser = function (index) {
        $scope._alerts.splice(index, 1);
    };
});
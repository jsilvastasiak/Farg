angular.module('currentApp').controller("tabManager", function ($scope, TabManager) {

    TabManager.addTab({
        name: 'Request'
    });
    TabManager.addTab({
        name: 'Items',
        tabFather: 'Request',
        status: false
    });

    $scope.TabManager = TabManager;

    $scope.onSelect = function () {
        TabManager.ChangedSelection();
    };

    $scope.generateRelatory = function () {
        var parans = "requestCode=" + TabManager.getDataKey('code') + "&client=" + TabManager.getDataKey('clientCode');
        window.open("/consult/request/request-relatory/?" + parans, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    };
});

angular.module("currentApp").directive('requestControl', function () {
    return {
        templateUrl: '/consult/request/request-control'
    }
});

angular.module("currentApp").directive('requestItems', function () {
    return {
        templateUrl: '/consult/request/request-items'
    }
});
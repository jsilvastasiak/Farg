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
    }
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
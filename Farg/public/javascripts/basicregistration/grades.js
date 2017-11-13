angular.module('currentApp').controller("tabManager", function ($scope, TabManager) {

    TabManager.addTab({
        name: 'Grades'
    });
    TabManager.addTab({
        name: 'Product',
        tabFather: 'Grades',
        status: false
    });

    $scope.TabManager = TabManager;

    $scope.onSelect = function () {
        TabManager.ChangedSelection();
    }
});

angular.module("currentApp").directive('gradeControl', function () {
    return {
        templateUrl: '/basicregistration/grades/grades-control'
    }
});

angular.module("currentApp").directive('productGrade', function () {
    return {
        templateUrl: '/basicregistration/grades/product-grade'
    }
});
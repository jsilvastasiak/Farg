angular.module('currentApp').controller("tabManager", function ($scope, TabManager) {

    TabManager.addTab({
        name: 'Produto'        
    });
    TabManager.addTab({
        name: 'Imagens',
        tabFather: 'Produto',
        status: false        
    });

    $scope.TabManager = TabManager;

    $scope.onSelect = function () {
        TabManager.ChangedSelection();
    }
});

angular.module("currentApp").directive('productControl', function () {
    return {
        templateUrl: '/basicregistration/products/products-control'
    }
});

angular.module("currentApp").directive('productImages', function () {
    return {
        templateUrl: '/basicregistration/products/product-images'
    }
});
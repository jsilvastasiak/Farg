
angular.module("currentApp").controller("clientProducts", function ($scope, $http, $uibModal) {
    const pagerProductsId = 'pgProducts';

    $scope.dtProducts = new $scope.ObjectDataSource('dtProducts', $scope, '/client/client-products/getProductsList', pagerProductsId);
    $scope.dtGrades = new $scope.ObjectDataSource('dtGrades', $scope, '/client/client-products/getGradesOptions');
    
    $scope.addPager(pagerProductsId, {
        changedCallback: $scope.dtProducts.dataBind
    });

    $scope.getProductValue = function (product) {
        return "R$ " + product.productValue.toString();
    };

    $scope.dtProducts.dataBind();
    $scope.dtGrades.dataBind();
});
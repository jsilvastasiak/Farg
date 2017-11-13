angular.module("currentApp").controller("clientProducts", function ($scope, Utils, $uibModal, $location, ClientCar) {
    const pagerProductsId = 'pgProducts';

    $scope.dtProducts = new $scope.ObjectDataSource('dtProducts', $scope, '/client/products/getProductsList', pagerProductsId);
    $scope.dtGrades = new $scope.ObjectDataSource('dtGrades', $scope, '/client/products/getGradesOptions');
    $scope.dtCategorys = new $scope.ObjectDataSource('dtCategorys', $scope, '/client/products/getCategorys');
    $scope.dtPaymentForm = new $scope.ObjectDataSource('dtPaymentForm', $scope, '/client/products/getPaymentFormOptions');
    $scope.dtPaymentForm.addOnDataBound(function () {
        if ($scope.dtPaymentForm.List.length > 0) {
            $scope._selectedPaymentForm = $scope.dtPaymentForm.List[0];
            ClientCar.setPaymentForm($scope.dtPaymentForm.List[0]);
        }
    });
    
    $scope.addPager(pagerProductsId, {
        changedCallback: $scope.dtProducts.dataBind
    });

    $scope._getGradeItem = function (selectedCode) {
        if ($scope.dtGrades.List && $scope.dtGrades.List.filter) {
            var filter = $scope.dtGrades.List.filter(function (el) {
                return el.gradeCode.toString() === selectedCode;
            });

            return filter.length > 0 ? filter[0] : {};
        } else
            return {};
    }

    /*Cálculo de descontos no produto*/
    $scope.getProductValue = function (product) {
        if (product) {
            return ClientCar.getProductValue(product);
        } else {
            return undefined;
        }
    };

    $scope.alteredGrade = function (product) {
        product.quantity = 1;
    };

    $scope.showInfo = function (product) {
        window.location = '/client/products/info/?id=' + product.productCode;
    };

    $scope.getTotal = function (product) {
        //Total é quantidade de grades vezes, quantidade de produtos por grade * valor do produto com descontos
        var total = product.quantity * ClientCar._getMinQuantity(product) * $scope.getProductValue(product);
        return total ? total.toFixed(2) : "";
    };

    $scope.getQuantity = function (product) {
        if (product.selectedGrade)
            return ClientCar._getMinQuantity(product);
        else
            return 0;
    };

    $scope.hasSelectedGrade = function (product) {
        return product.selectedGrade ? true : false;
    };

    $scope.isValidItem = function (product) {
        return ClientCar.isValidProduct(product);
    }

    $scope.paymentFormSelected = function (paymentForm) {
        ClientCar.setPaymentForm(paymentForm);
    };    

    $scope.addProduct = function (product) {        
        ClientCar.addProduct(product);
    };

    $scope.editProduct = function (product) {        
        ClientCar.editProduct(product);
    };

    $scope.removeProduct = function (product) {        
        ClientCar.removeProduct(product);
    };

    $scope.filterCategory = function (category) {
        $scope.dtCategorys.List.forEach(function (el) { el.isSelected = false; });
        category.isSelected = true;

        $scope.dtProducts.setFilters({ categoryCode: category.code });
        $scope.dtProducts.dataBind();
    };

    $scope.gradeOptionLoad = function (product) {
        if (!product.gradesOptions) {
            Utils.get('/client/products/getProductGradeOptions', {
                product: {
                    code: product.productCode
                }
            }, function (res) {
                if (res.data) {
                    product.gradesOptions = res.data.result;
                    product.showGradeOption = true;
                }
            });
        }
    };

    $scope.dtProducts.dataBind();
    $scope.dtGrades.dataBind();
    $scope.dtCategorys.dataBind();
    ClientCar.setGrades($scope.dtGrades);
    $scope.dtPaymentForm.dataBind();
});
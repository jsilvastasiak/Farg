//**Controle para chamar dataBind de outros objetos presentes em outro ng-controller
angular.module("currentApp").factory("Bridge", function ($window, $http) {
    var dataBindsControl = [];

    return {
        addDataBindControl: function (control) {
            dataBindsControl.push(control);
        },
        dataBind: function (filters) {
            for (var i = 0; i < dataBindsControl.length; i++) {
                if (dataBindsControl[i].setFilters)
                    dataBindsControl[i].setFilters(filters);
                if (dataBindsControl[i].dataBind)
                    dataBindsControl[i].dataBind();
            }
        }
    };
});

angular.module("currentApp").controller("productCategorysCtrl", function ($scope, Bridge) {
    $scope.dtCategorys = new $scope.ObjectDataSource('dtCategorys', $scope, '/client/products/getCategorys');

    $scope.filterCategory = function (category) {
        $scope.dtCategorys.List.forEach(function (el) { el.isSelected = false; });
        category.isSelected = true;
        
        Bridge.dataBind({ categoryCode: category.code });
    };

    $scope.dtCategorys.dataBind();
});

angular.module("currentApp").controller("clientProducts", function ($scope, Utils, $uibModal, $location, ClientCar, Bridge) {
    const pagerProductsId = 'pgProducts';
    $scope.dbGradeId = 'dbGrade';

    $scope.dtProducts = new $scope.ObjectDataSource('dtProducts', $scope, '/client/products/getProductsList', pagerProductsId);
    //$scope.dtGrades = new $scope.ObjectDataSource('dtGradesProduct', $scope, '/client/products/getGradesOptions');    

    //$scope.dtPaymentForm.addOnDataBound(function () {
    //    if (!PaymentFormCtrl.getPaymentForm() && $scope.dtPaymentForm.List.length > 0) {
    //        $scope.paymentFormCode = $scope.dtPaymentForm.List[0].code.toString();
    //        //ClientCar.setPaymentForm($scope.dtPaymentForm.List[0]);
    //        PaymentFormCtrl.setPaymentForm(selected[0]);
    //    } else {
    //        //$scope.paymentFormCode = ClientCar.getPaymentForm().code.toString();
    //        $scope.paymentFormCode = PaymentFormCtrl.getPaymentForm().code.toString();
    //    }
    //});
    
    $scope.addPager(pagerProductsId, {
        changedCallback: $scope.dtProducts.dataBind
    });

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
    
    $scope.addProduct = function (product) {        
        ClientCar.addProduct(product);
    };

    $scope.editProduct = function (product) {        
        ClientCar.editProduct(product);
    };

    $scope.removeProduct = function (product) {        
        ClientCar.removeProduct(product);
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
                }
            });
        }
    };
        
    $scope.dtProducts.dataBind();    
    //$scope.dtGrades.dataBind();
    //Adiciona dataSource para ser chamado no Evento da Bridge
    Bridge.addDataBindControl($scope.dtProducts);
    
    //ClientCar.setGrades($scope.dtGrades);
    //$scope.dtPaymentForm.dataBind();
});
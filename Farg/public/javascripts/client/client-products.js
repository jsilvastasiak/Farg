angular.module("currentApp").controller("clientProducts", function ($scope, $http, $uibModal, $location) {
    const pagerProductsId = 'pgProducts';

    $scope.dtProducts = new $scope.ObjectDataSource('dtProducts', $scope, '/client/products/getProductsList', pagerProductsId);
    $scope.dtGrades = new $scope.ObjectDataSource('dtGrades', $scope, '/client/products/getGradesOptions');
    $scope.dtPaymentForm = new $scope.ObjectDataSource('dtPaymentForm', $scope, '/client/products/getPaymentFormOptions');
    $scope.dtPaymentForm.addOnDataBound(function () {
        if ($scope.dtPaymentForm.List.length > 0)
            $scope._selectedPaymentForm = $scope.dtPaymentForm.List[0];
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
        var discountValueCli = ($scope.getValueOrDefault(product.discountValueCli) * product.productValue);
        var discountGrade = 0;
        var discountPaymentForm = 0;

        if (product.selectedGrade)
            discountGrade = $scope.getValueOrDefault($scope._getGradeItem(product.selectedGrade).discountValue) * product.productValue;


        if ($scope._selectedPaymentForm)
            discountPaymentForm = $scope.getValueOrDefault($scope._selectedPaymentForm.discountValue) * product.productValue;

        return (parseFloat(product.productValue) - discountValueCli - discountGrade - discountPaymentForm).toFixed(2);
    };

    $scope.alteredGrade = function (product) {        
        product.quantity = $scope._getGradeItem(product.selectedGrade).minQuantity;        
    };

    $scope.showInfo = function (product) {
        window.location = '/client/products/info/?id=' + product.productCode;
    };

    $scope.getTotal = function (product) {
        var total = product.quantity * $scope.getProductValue(product);
        return total ? total.toFixed(2) : "";
    };

    $scope.getQuantity = function (product) {
        if (product.selectedGrade)
            return $scope._getGradeItem(product.selectedGrade).minQuantity;
        else
            return 0;
    };

    $scope.hasSelectedGrade = function (product) {
        return product.selectedGrade ? true : false;
    };

    $scope.isValidItem = function (product) {
        if (!product.selectedGrade)
            return false;

        if (!product.quantity)
            return false;

        if (product.quantity < $scope.getQuantity(product))
            return false;

        return true;
    };

    $scope.paymentFormSelected = function (paymentForm) {
        $scope._selectedPaymentForm = paymentForm;
    };

    $scope._alterItem = function (product, path, next) {
        $scope.post(path, {
            product: {
                code: product.productCode,
                gradeCode: $scope._getGradeItem(product.selectedGrade).gradeCode,
                paymentFormCode: $scope._selectedPaymentForm.code,
                quantity: product.quantity
            }
        }, function (res) {
            if (res.data.message) {
                $scope.showMessageUser({
                    message: res.data.message,
                    type: res.data.type
                });
            } else {
                next();
            }
        });
    };

    $scope.addProduct = function (product) {
        $scope._alterItem(product, '/client/products/addItem', function () {
            $scope.showMessageUser({
                message: 'Item adicionado ao carrinho com sucesso',
                type: 'success'
            });
            product.inSession = true;
        });
    };

    $scope.editProduct = function (product) {
        $scope._alterItem(product, '/client/products/editItem', function () {
            $scope.showMessageUser({
                message: 'Item atualizado com sucesso',
                type: 'success'
            });
            product.inSession = true;
        });
    };

    $scope.removeProduct = function (product) {
        $scope._alterItem(product, '/client/products/removeItem', function () {
            $scope.showMessageUser({
                message: 'Item removido do carrinho com sucesso',
                type: 'success'
            });
            product.inSession = false;
        });
    };

    $scope.dtProducts.dataBind();
    $scope.dtGrades.dataBind();
    $scope.dtPaymentForm.dataBind();
});
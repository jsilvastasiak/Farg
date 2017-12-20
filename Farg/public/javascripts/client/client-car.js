angular.module("currentApp").controller("clientCar", function ($scope, $http, $location, Utils, ClientCar) {

    $scope.dtCarItems = new $scope.ObjectDataSource('dtCarItems', $scope, '/client/car/getCarItemList');
    $scope.dtPaymentForm = new $scope.ObjectDataSource('dtPaymentForm', $scope, '/client/car/getPaymentFormList');
    $scope.dtGrades = new $scope.ObjectDataSource('dtGrades', $scope, '/client/products/getGradesOptions');

    $scope.dtCarItems.addOnDataBound(function () {
        if ($scope.dtCarItems.List.length > 0) {
            //$scope.totalItems = $scope.dtCarItems.List.length;
            $scope.dtCarItems.List.forEach(function (el) {
                el.gradeCode = el.gradeCode.toString();
            });
        }
    });

    $scope.dtPaymentForm.addOnDataBound(function () {
        if ($scope.dtPaymentForm.List.length > 0) {
            var selectedsForm = $scope.dtPaymentForm.List.filter(function (el) {
                return el.isSelected;
            });

            if (selectedsForm.length > 0) {
                $scope.paymentFormCode = selectedsForm[0].code.toString();
                ClientCar.setPaymentForm(selectedsForm[0]);
            }
        }
    });
            
    $scope.toMoney = function (value) {
        return value ? Utils.toMoney(value, "R$") : null;
    };

    $scope.getTotalValue = function (item) {
        var product = new ClientCar.Product();
        product.selectedGrade = item.gradeCode;

        var totalValue = item.quantity * ClientCar._getMinQuantity(product) * item.unitValue;

        return totalValue ? totalValue : null;
    };       

    $scope.getMinQuantity = function (item) {
        var product = new ClientCar.Product();
        product.selectedGrade = item.gradeCode;

        return ClientCar._getMinQuantity(product);
    };

    $scope.effetiveRequest = function () {
        Utils.post('/client/car/effetiveRequest', null, function (res) {
            if (res.data) {
                if (res.data.status) {
                    if (res.data.status === 0)
                        window.location = "/client/car/request-effetive";
                    else
                        window.location = "/client/car/request-fail";
                } else {
                    if (res.data.message)
                        Utils.toMessage(res.data.message, res.data.type);
                }
            }
        });
    };

    $scope.redirect = function () {
        window.location = "/client/products";
    };

    $scope.getProductInfo = function (item) {
        if (item) {
            var product = new ClientCar.Product();
            product.code = item.productCode;
            var info = ClientCar.getProductInfo(product);

            return info;
        }
    };
    
    $scope.dtGrades.dataBind();
    ClientCar.setGrades($scope.dtGrades);

    $scope.dtCarItems.dataBind();
    $scope.dtPaymentForm.dataBind();    
});
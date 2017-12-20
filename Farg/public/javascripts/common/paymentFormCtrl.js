angular.module("currentApp").controller("PaymentFormCtrl", function ($scope, Utils, ClientCar) {

    $scope.dtPaymentForm = new $scope.ObjectDataSource('paymentFormCtrl_dtPaymentForm', $scope, '/client/car/getPaymentFormList');
    $scope.dtCarItems = new $scope.ObjectDataSource('paymentFormCtrl_dtCarItems', $scope, '/client/car/getCarItemList');
    $scope.dtGrades = new $scope.ObjectDataSource('paymentFormCtrl_dtGrades', $scope, '/client/products/getGradesOptions');
    
    $scope.dtCarItems.addOnDataBound(function () {
        if ($scope.dtCarItems.List.length > 0) {
            $scope.totalItems = $scope.dtCarItems.List.length;
        }
    });

    $scope.dtPaymentForm.addOnDataBound(function () {
        if (!ClientCar.getPaymentForm() && $scope.dtPaymentForm.List.length > 0) {
            $scope.paymentFormCode = $scope.dtPaymentForm.List[0].code.toString();
            ClientCar.setPaymentForm($scope.dtPaymentForm.List[0]);
        } else {
            $scope.paymentFormCode = ClientCar.getPaymentForm().code.toString();            
        }        
    });

    $scope.getTotalValue = function (item) {
        var product = new ClientCar.Product();
        product.selectedGrade = item.gradeCode;

        var totalValue = item.quantity * ClientCar._getMinQuantity(product) * item.unitValue;

        return totalValue ? totalValue : null;
    };

    //Total geral do pedido
    $scope.getTotalGeneral = function () {
        var total = null;

        if ($scope.dtCarItems.List.forEach) {
            $scope.dtCarItems.List.forEach(function (el) {
                total += $scope.getTotalValue(el);
            });
        }

        return total;
    };

    $scope.paymentFormSelected = function () {
        var selected = $scope.dtPaymentForm.List.filter(function (el) {
            return el.code.toString() === $scope.paymentFormCode;
        });

        if (selected.length > 0)
            //ClientCar.setPaymentForm(selected[0]);
            ClientCar.setPaymentForm(selected[0]);
        else {
            Utils.toMessage('Forma de pagamento não selecionada', 'danger');
        }
    };    

    $scope.toMoney = function (value) {
        return value ? Utils.toMoney(value, "R$") : null;
    };

    $scope.dtGrades.dataBind();
    $scope.dtCarItems.dataBind();
    $scope.dtPaymentForm.dataBind();

    ClientCar.setGrades($scope.dtGrades);
});
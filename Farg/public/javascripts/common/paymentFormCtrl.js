angular.module("currentApp").factory("PaymentFormFact", function (Utils) {
    //Métodos registrados para serem chamados quando o controle for alterado
    var _paymentFormChangedlistener = [];
    //Método responsável por atualizar controle de forma de pagamento
    var _databindPaymentForm = null;
    return {
        PaymentFormChangedListener: function (action) {
            _paymentFormChangedlistener.push(action);
        },
        PaymentFormChanged: function (parans) {
            _paymentFormChangedlistener.forEach(function (action) {
                action(parans);
            });
        },
        DatabindPaymentForm: function (action) {
            _databindPaymentForm = action;
        },
        RefreshPaymentFormCtrl: function () {
            try {
                _databindPaymentForm();
            } catch (e) {
                Utils.toMessage(e.message, 'danger');
            }
        }
    }
});

angular.module("currentApp").controller("PaymentFormCtrl", function ($scope, Utils, ClientCar, PaymentFormFact) {

    $scope.dtPaymentForm = new $scope.ObjectDataSource('paymentFormCtrl_dtPaymentForm', $scope, '/client/car/getPaymentFormList');
    $scope.dtCarItems = new $scope.ObjectDataSource('paymentFormCtrl_dtCarItems', $scope, '/client/car/getCarItemList');
    $scope.dtGrades = new $scope.ObjectDataSource('paymentFormCtrl_dtGrades', $scope, '/client/products/getGradesOptions');
    
    $scope.dtCarItems.addOnDataBound(function () {
        if ($scope.dtCarItems.List.length > 0) {
            $scope.totalItems = $scope.dtCarItems.List.length;
        }
    });

    $scope.dtPaymentForm.addOnDataBound(function () {
        if (ClientCar.getPaymentForm()) {            
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

        if (selected.length > 0) {
            //ClientCar.setPaymentForm(selected[0]);
            ClientCar.setPaymentForm(selected[0], function (paymentForm) {
                PaymentFormFact.PaymentFormChanged();
                $scope.loadData();
            });
        }
        else {
            Utils.toMessage('Forma de pagamento não selecionada', 'danger');
        }
    };    

    $scope.toMoney = function (value) {
        return value ? Utils.toMoney(value, "R$") : null;
    };

    $scope.loadData = function () {
        $scope.dtGrades.dataBind();
        $scope.dtCarItems.dataBind();
        $scope.dtPaymentForm.dataBind();
    };

    $scope.loadData();

    ClientCar.setGrades($scope.dtGrades);
    PaymentFormFact.DatabindPaymentForm($scope.loadData);
});
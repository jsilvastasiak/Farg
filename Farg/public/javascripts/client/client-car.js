angular.module("currentApp").controller("clientCar", function ($scope, $http, $location, Utils, ClientCar, PaymentFormFact) {

    $scope.dtCarItems = new $scope.ObjectDataSource('dtCarItems', $scope, '/client/car/getCarItemList');
    $scope.dtGrades = new $scope.ObjectDataSource('dtGrades', $scope, '/client/products/getGradesOptions');

    $scope.dtCarItems.addOnDataBound(function () {
        if ($scope.dtCarItems.List.length > 0) {
            //$scope.totalItems = $scope.dtCarItems.List.length;
            $scope.dtCarItems.List.forEach(function (el) {
                el.loadedGradeOptions = false; //Variável de controle para iniciar dropbox com algum valor na grid
                el.gradeCode = el.gradeCode.toString();
            });
        }
    });

    $scope.dtGrades.addOnDataBound(function () {
        if ($scope.dtGrades.List.length > 0) {
            //Percorre lista do carrinho para colocar opção de grade escolhida
            $scope.dtCarItems.List.forEach(function (item) {
                item.gradesOptions = $scope.dtGrades.List.filter(function (grade) {
                    return grade.gradeCode.toString() === item.gradeCode.toString();
                });
            });
        };
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
                if (!(res.data.status == undefined)) {
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

    $scope.gradeOptionLoad = function (item, name, index) {
        if (!item.gradesOptions || !item.loadedGradeOptions) {            
            var $loadIcon = $("*[name='loadIcon']")[index];
            $($loadIcon).show();

            Utils.get('/client/products/getProductGradeOptions', {
                product: {
                    code: item.productCode
                }
            }, function (res) {
                if (res.data) {
                    var select = $("*[name='" + name + "']")[index];
                    var $loadIcon = $("*[name='loadIcon']")[index];
                    $(select).children("option[value='0']").remove();
                    $($loadIcon).hide();

                    item.gradesOptions = res.data.result;

                    item.loadedGradeOptions = true;
                }
            });
        }
    };

    $scope.alteredGrade = function (item) {
        item.quantity = 1;
    };
    //Forma de pagamento alterada
    PaymentFormFact.PaymentFormChangedListener(function () {
        $scope.dtGrades.dataBind();
        ClientCar.setGrades($scope.dtGrades);
        $scope.dtCarItems.dataBind();
    });

    $scope.dtGrades.dataBind();
    ClientCar.setGrades($scope.dtGrades);

    $scope.dtCarItems.dataBind();       
});
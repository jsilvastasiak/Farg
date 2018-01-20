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

angular.module("currentApp").controller("clientProducts", function ($scope, Utils, $uibModal, $location, ClientCar, Bridge, PaymentFormFact) {
    const pagerProductsId = 'pgClientProduct';
    $scope.dbGradeId = 'dbGrade';
    //Função para carga de opções de grade para items já na sessão
    var loadGradeOptions = function () {
        if ($scope.dtGrades.List.length > 0) {
            if ($scope.dtProducts.List.forEach) {
                //Percorre lista do carrinho para colocar opção de grade escolhida
                $scope.dtProducts.List.forEach(function (item) {
                    if (item.inSession) {
                        item.gradesOptions = $scope.dtGrades.List.filter(function (grade) {
                            return grade.gradeCode.toString() === item.selectedGrade.toString();
                        });
                    }
                });
            }
        };
    }

    $scope.dtProducts = new $scope.ObjectDataSource('dtProducts', $scope, '/client/products/getProductsList', pagerProductsId);
    $scope.dtGrades = new $scope.ObjectDataSource('dtGrades', $scope, '/client/products/getGradesOptions');

    $scope.dtProducts.addOnDataBound(function () {
        if ($scope.dtProducts.List.forEach) {
            //Percorre lista do carrinho para colocar opção de grade escolhida
            $scope.dtProducts.List.forEach(function (item) {
                item.loadedGradeOptions = false;                                
            });
        };
    });
    $scope.dtProducts.addOnDataBound(loadGradeOptions);        
    $scope.dtGrades.addOnDataBound(loadGradeOptions);

    $scope.addPager(pagerProductsId, {
        changedCallback: function () {
            $scope.dtProducts.dataBind();
        },
        itemsPerPage: 12
    });

    /*Cálculo de descontos no produto*/
    $scope.getProductValue = function (product) {
        if (product) {
            return Utils.toMoney(ClientCar.getProductValue(product), "R$");
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
        var total = product.quantity * ClientCar._getMinQuantity(product) * ClientCar.getProductValue(product);
        return total ? Utils.toMoney(total, "R$") : "";
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
        ClientCar.addProduct(product, function () {
            PaymentFormFact.RefreshPaymentFormCtrl();
        });
    };

    $scope.editProduct = function (product) {
        ClientCar.editProduct(product, function () {
            PaymentFormFact.RefreshPaymentFormCtrl();
        });
    };

    $scope.removeProduct = function (product) {        
        ClientCar.removeProduct(product, function () {
            PaymentFormFact.RefreshPaymentFormCtrl();
        });
    };
    
    $scope.gradeOptionLoad = function (product, name, index) {
        if (!product.gradesOptions || !product.loadedGradeOptions) {
            var $loadIcon = $("*[name='loadIcon']")[index];
            $($loadIcon).show();

            Utils.get('/client/products/getProductGradeOptions', {
                product: {
                    code: product.productCode
                }
            }, function (res) {
                if (res.data) {
                    var select = $("*[name='" + name + "']")[index];
                    var $loadIcon = $("*[name='loadIcon']")[index];
                    $(select).children("option[value='0']").remove();
                    $(select).blur();
                    $(select).focus();
                    $($loadIcon).hide();
                     
                    product.gradesOptions = res.data.result;
                    product.loadedGradeOptions = true;
                }
            }, null, true);
        }
    };
        
    $scope.dtProducts.dataBind();    
    $scope.dtGrades.dataBind();
    //Adiciona dataSource para ser chamado no Evento da Bridge
    Bridge.addDataBindControl($scope.dtProducts);
    
    //ClientCar.setGrades($scope.dtGrades);
    //$scope.dtPaymentForm.dataBind();
});

angular.module("currentApp").directive("productContainer", function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var setPosition = function () {
                //Tamanho do container
                var widthElementDefault = parseInt(element.css("width").replace("px", "")) + parseInt(element.css("margin-left").replace("px",""));
                //Pega tamanho da div que contém o container
                var widthParent = parseInt(element.parent("div").css("width").replace("px", ""));

                var qtdElements = Math.floor(widthParent / widthElementDefault);
                var widthElements = qtdElements * widthElementDefault;
                var diff = (widthParent - widthElements) / qtdElements;

                var valuePosition = (Math.round((diff / widthParent) * 100));

                valuePosition = qtdElements === 1 ? Math.floor(valuePosition / 2) : valuePosition;

                element.css("left", valuePosition + "%");

            };
            $(".main-sidebar").resize(function () {
                setPosition();
            });
                        
            $(window).resize(function () {
                setPosition();
            });

            setPosition();
        }
    }
});


angular.module("currentApp").controller("clientProductInfo", function ($scope, Utils, ClientCar) {

    //$scope.productId = Utils.getUrlParameter("id");
    $scope.productId = Utils.URL["id"];

    $scope._Index = 0;
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.dtImages.List.length - 1;
    };
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.dtImages.List.length - 1) ? ++$scope._Index : 0;
    };
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };
        
    $scope.dtGrades = new $scope.ObjectDataSource('dtGrades', $scope, '/client/products/getGradesOptions');
    $scope.dtInfo = new $scope.ObjectDataSource('dtInfo', $scope, '/client/products/info/getInfo/?id=' + $scope.productId);
    $scope.dtImages = new $scope.ObjectDataSource('dtImages', $scope, '/client/products/info/getImages/?id=' + $scope.productId);

    $scope.product = {};

    $scope.dtInfo.addOnDataBound(function () {
        if ($scope.dtInfo.List.length > 0)
            $scope.product = $scope.dtInfo.List[0];
    });
        
    $scope.getProductValue = function (product) {
        if(product)
            return ClientCar.getProductValue(product);
        else {
            return undefined;
        }
    };

    $scope.alteredGrade = function (product) {
        product.quantity = 1;
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

    $scope.getTotal = function (product) {
        var total = product.quantity * ClientCar._getMinQuantity(product) * $scope.getProductValue(product);
        return total ? total.toFixed(2) : "";
    };

    $scope.isValidItem = function (product) {
        return ClientCar.isValidProduct(product);
    };

    $scope.hasSelectedGrade = function (product) {
        return product.selectedGrade ? true : false;
    };

    $scope.getQuantity = function (product) {
        if (product.selectedGrade)
            return ClientCar._getMinQuantity(product);
        else
            return 0;
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

    $scope.dtGrades.dataBind();
    $scope.dtImages.dataBind();
    $scope.dtInfo.dataBind();

    ClientCar.setGrades($scope.dtGrades);
});

angular.module("currentApp").directive("sliderImage", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            attrs.$observe('fileName', function (value) {
                if (value) {
                    var filename = scope.$eval(value);                                        
                    var wrapperControl = document.getElementById(attrs.wrapperControlId);

                    //Atributos elemento principal
                    element.attr({
                        src: filename,
                        'data-large-img-url': filename,
                        'data-large-img-wrapper': attrs.wrapperControlId ? attrs.wrapperControlId : ''
                    });

                    if (!element.attr("id")) {
                        element.attr("id", 'image' + new Date().getMilliseconds());
                    }

                    //Configuração do Magnifier
                    m.attach({
                        thumb: '#' + element.attr("id"),
                        largeWrapper: attrs.wrapperControlId ? attrs.wrapperControlId : '',
                        zoom: 5,
                        mode: 'outside',
                        onthumbenter: function () {
                            if (attrs.wrapperControlId) {
                                var wrapperControl = document.getElementById(attrs.wrapperControlId);
                                                                
                                wrapperControl.style.display = 'block';
                                wrapperControl.style.position = 'absolute';
                                wrapperControl.style.zIndex = 5000;                                
                            }
                        },
                        onthumbleave: function () {
                            if (attrs.wrapperControlId) {
                                var wrapperControl = document.getElementById(attrs.wrapperControlId);
                                                                
                                wrapperControl.style.display = 'none';
                            }
                        }
                    });
                }
            })
        }
    }
});
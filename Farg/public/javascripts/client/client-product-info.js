

angular.module("currentApp").controller("clientProductInfo", function ($scope, Utils) {

    $scope.productId = Utils.getUrlParameter("id");

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

    $scope.dtInfo.addOnDataBound(function () {
        if ($scope.dtInfo.List.length > 0)
            $scope.product = $scope.dtInfo.List[0];
    });
    
    $scope.dtGrades.dataBind();
    $scope.dtImages.dataBind();
    $scope.dtInfo.dataBind();
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
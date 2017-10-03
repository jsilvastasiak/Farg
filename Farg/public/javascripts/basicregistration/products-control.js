angular.module("currentApp").controller("tblProducts", function ($scope, $http, $uibModal, TabManager) {
    const pagerProductsId = 'pgProducts';
    $scope.dtProducts = new $scope.ObjectDataSource('dtProducts', $scope, '/basicregistration/products/getProductsList', pagerProductsId);

    $scope.dtClient.addOnDataBound(function () {
        TabManager.clearDataKeys();
        TabManager.clearTabRef('Produtos');
    });

    /*Modo Edição*/
    $scope.editProduct = function (product) {
        if (product) {
            $scope.selectedProduct = product;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myProduct.html',
                controller: 'ProductModalCtrl',
                resolve: {
                    parans: function () {
                        return {
                            isFind: false,
                            productEdit: $scope.selectedProduct,
                            title: 'Editar Produto'
                        };
                    }
                }
            });

            $scope.modalInstance.result.then(function (productToUpdate) {
                if (productToUpdate) {
                    var _product = {
                        code: productToUpdate.iptCode.$modelValue,
                        productName: productToUpdate.iptProductName.$modelValue,
                        categoryCode: productToUpdate.dbCategory.$modelValue,
                        idcActive: productToUpdate.dbStatus.$modelValue
                    };

                    $scope.post('/basicregistration/products/updateProduct', {
                        product: _product
                    },
                        function (res) {
                            $scope.showMessageUser({
                                message: res.data.message,
                                type: res.data.type
                            });
                            //$scope.dataBind();
                            $scope.dtProducts.dataBind();
                        });
                }
            });

            $scope.selectedProduct = undefined;
        }
    };
    /*Modo novo*/
    $scope.newProduct = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myProduct.html',
            controller: 'ProductModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: false,
                        title: 'Cadastrar Produto'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (productToInsert) {
            if (productToInsert) {
                var _product = {
                    code: productToInsert.iptCode.$modelValue,
                    productName: productToInsert.iptProductName.$modelValue,
                    categoryCode: productToInsert.dbCategory.$modelValue,
                    idcActive: productToInsert.dbStatus.$modelValue
                };

                $scope.post('/basicregistration/products/insertProduct',
                    {
                        product: _product
                    }, function (response) {
                        $scope.showMessageUser({
                            message: res.data.message,
                            type: res.data.type
                        });
                        //$scope.dataBind();
                        $scope.dtProducts.dataBind();
                    });

                $scope.dtProducts.cancelFilters();
            }
        });
    };
    /*Modo Busca*/
    $scope.findProduct = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myProduct.html',
            controller: 'ProductModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: true,
                        title: 'Procurar'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (productToFind) {
            if (productToFind) {
                var _filter = {
                    code: productToFind.iptCode.$modelValue,
                    productName: productToFind.iptProductName.$modelValue,
                    categoryCode: productToFind.dbCategory.$modelValue,
                    idcActive: productToFind.dbStatus.$modelValue
                };

                $scope.dtProducts.setFilters(_filter);
                $scope.dtProducts.dataBind();
            }
        });
    };

    $scope.deleteProduct = function (product) {
        $scope.post('/basicregistration/products/deleteProduct',
            {
                product: product
            }, function (response) {
                $scope.showMessageUser({
                    message: response.data.message,
                    type: response.data.type
                });

                $scope.dtProducts.dataBind();
            });
    };

    //ao clicar em qualquer linha da tabela, habilita aba de endereços
    $scope.tblProducts_OnSelectedRow = function (product) {
        TabManager.setDataKey('productCode', product.code);
        TabManager.enableChildrenTabs('Produtos');
    }
    
    $scope.addPager(pagerProductsId, {
        changedCallback: $scope.dtProducts.dataBind
    });


    $scope.dtProducts.dataBind();
});

angular.module("currentApp").controller('ProductModalCtrl', function ($scope, $http, $uibModalInstance, parans) {

    if (parans) {
        $scope.isFind = false;
        $scope.isEdit = false;
        $scope.titleModal = parans.title;

        if (parans.productEdit) {
            $scope.code = parans.productEdit.code;
            $scope.productName = parans.productEdit.productName;
            $scope.categoryCode = parans.productEdit.categoryCode;
            $scope.idcActive = parans.productEdit.idcActive            
            $scope.isEdit = true;
        } else {
            $scope.isFind = parans.isFind;
            $scope.isEdit = false;
        }
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmProduct) {
        $uibModalInstance.close(frmProduct);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
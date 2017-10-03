
angular.module("currentApp").controller("tblImageProducts", function ($scope, $http, $uibModal, TabManager) {
    const pagerImageProductId = 'pgImageProduct';

    $scope.dtImageProducts = new $scope.ObjectDataSource('dtImageProducts', $scope, '/basicregistration/products/images/getImagesList', pagerImageProductId);
    $scope.dtImageProducts.onSelecting = function (parans) {
        parans.productCode = TabManager.getDataKey('productCode');
    };

    //No momento em que houver a seleção desta tab recarrega os dados
    TabManager.onChangeSelection(function () {
        $scope.dtImageProducts.dataBind();
    });
    /*Modo Edição*/
    $scope.editImageProduct = function (imageProduct) {
        if (imageProduct) {
            $scope.selectedImageProduct = imageProduct;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myImageProduct.html',
                controller: 'ImageProductModalCtrl',
                resolve: {
                    parans: function () {
                        return {
                            isFind: false,
                            imageEdit: $scope.selectedImageProduct,
                            title: 'Editar Imagem'
                        };
                    }
                }
            });

            $scope.modalInstance.result.then(function (imageToUpdate) {
                if (imageToUpdate) {
                    var _image = {
                        code: TabManager.getDataKey('productCode'),
                        imageCode: imageToUpdate.iptCode.$modelValue,
                        idcActive: imageToUpdate.dbStatus.$modelValue
                    };

                    $scope.post('/basicregistration/products/images/updateImage', {
                        image: _image
                    },
                        function (res) {
                            $scope.showMessageUser({
                                message: res.data.message,
                                type: res.data.type
                            });
                            //$scope.dataBind();
                            $scope.dtImageProducts.dataBind();
                        });
                }
            });

            $scope.selectedImageProduct = undefined;
        }
    };
    /*Modo novo*/
    $scope.newImageProduct = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myImageProduct.html',
            controller: 'ImageProductModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: false,
                        title: 'Cadastrar Imagem'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (imageToInsert) {
            if (imageToInsert) {
                var _image = {
                    code: TabManager.getDataKey('productCode'),                    
                    idcActive: imageToInsert.dbStatus.$modelValue
                };

                $scope.post('/basicregistration/products/images/insertImage',
                    {
                        image: _image
                    }, function (response) {
                        $scope.showMessageUser({
                            message: response.data.message,
                            type: response.data.type
                        });
                        //$scope.dataBind();
                        $scope.dtImageProducts.dataBind();
                    });

                $scope.dtImageProducts.cancelFilters();
            }
        });
    };
    /*Modo Busca*/
    $scope.findImageProduct = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myImageProduct.html',
            controller: 'ImageProductModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: true,
                        title: 'Procurar'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (imageToFind) {
            if (imageToFind) {
                var _filter = {
                    code: TabManager.getDataKey('productCode'),
                    imageToFind: imageToInsert.iptCode.$modelValue,
                    imageToFind: imageToInsert.dbStatus.$modelValue
                };

                $scope.dtImageProducts.setFilters(_filter);
                $scope.dtImageProducts.dataBind();
            }
        });
    };

    $scope.deleteImageProduct = function (image) {
        $scope.post('/basicregistration/products/images/deleteImage',
            {
                image: image
            }, function (response) {
                $scope.showMessageUser({
                    message: response.data.message,
                    type: response.data.type
                });

                $scope.dtImageProducts.dataBind();
            });
    };

    $scope.addPager(pagerImageProductId, {
        changedCallback: $scope.dtImageProducts.dataBind
    });
});

angular.module("currentApp").controller('ImageProductModalCtrl', function ($scope, $http, $uibModalInstance, UploadCtrl, parans) {

    if (parans) {

        var getImageStatusOptions = function (http) {
            return http.get('/basicregistration/products/images/getImageStatusOptions');
        };

        getImageStatusOptions($http).then(function (res) {
            $scope.statusOptions = res.data;
        });

        $scope.isFind = false;
        $scope.isEdit = false;
        $scope.titleModal = parans.title;

        if (parans.imageEdit) {
            $scope.code = parans.imageEdit.imageCode;
            $scope.idcActive = parans.imageEdit.idcActive;            
            $scope.isEdit = true;
        } else {
            $scope.isFind = parans.isFind;
            $scope.isEdit = false;
        }
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmImageProduct) {
        $uibModalInstance.close(frmImageProduct);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
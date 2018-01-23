
angular.module("currentApp").controller("tblProductImages", function ($scope, $http, $uibModal, TabManager) {
    const pagerProductImageId = 'pgProductImage';

    $scope.dtProductImages = new $scope.ObjectDataSource('dtProductImages', $scope, '/basicregistration/products/images/getImagesList', pagerProductImageId);
    $scope.dtProductImages.onSelecting = function (parans) {
        parans.productCode = TabManager.getDataKey('productCode');
    };

    //No momento em que houver a seleção desta tab recarrega os dados
    TabManager.onChangeSelection(function () {
        $scope.dtProductImages.dataBind();
    });
    /*Modo Edição*/
    $scope.editProductImage = function (ProductImage) {
        if (ProductImage) {
            $scope.selectedProductImage = ProductImage;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myProductImage.html',
                controller: 'ProductImageModalCtrl',
                resolve: {
                    parans: function () {
                        return {
                            isFind: false,
                            imageEdit: $scope.selectedProductImage,
                            title: 'Editar Imagem'
                        };
                    }
                }
            });

            $scope.modalInstance.result.then(function (imageToUpdate) {
                if (imageToUpdate) {
                    var _image = {
                        productCode: TabManager.getDataKey('productCode'),
                        imageCode: imageToUpdate.iptCode.$modelValue,
                        imageDescription: imageToUpdate.iptDescription.$modelValue,
                        fileName: imageToUpdate.fileName,
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
                            $scope.dtProductImages.dataBind();
                        });
                }
            });

            $scope.selectedProductImage = undefined;
        }
    };
    /*Modo novo*/
    $scope.newProductImage = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myProductImage.html',
            controller: 'ProductImageModalCtrl',
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
                    productCode: TabManager.getDataKey('productCode'),
                    imageDescription: imageToInsert.iptDescription.$modelValue,
                    fileName: imageToInsert.fileName,
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
                        $scope.dtProductImages.dataBind();
                    });

                $scope.dtProductImages.cancelFilters();
            }
        });
    };
    /*Modo Busca*/
    $scope.findProductImage = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myProductImage.html',
            controller: 'ProductImageModalCtrl',
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
                    productCode: TabManager.getDataKey('productCode'),
                    imageCode: imageToFind.iptCode.$modelValue,
                    imageDescription: imageToFind.iptDescription.$modelValue,
                    idcActive: imageToFind.dbStatus.$modelValue
                };

                $scope.dtProductImages.setFilters(_filter);
                $scope.dtProductImages.dataBind();
            }
        });
    };

    $scope.deleteProductImage = function (image) {
        $scope.post('/basicregistration/products/images/deleteImage',
            {
                image: image
            }, function (response) {
                $scope.showMessageUser({
                    message: response.data.message,
                    type: response.data.type
                });

                $scope.dtProductImages.dataBind();
            });
    };

    $scope.showImage = function (image) {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'visualizationImage.html',
            controller: 'ImageVisualizationModelCtrl',
            resolve: {
                parans: function () {
                    return {
                        image: image
                    };
                }
            }
        });
    };

    $scope.addPager(pagerProductImageId, {
        changedCallback: function () {
            $scope.dtProductImages.dataBind();
        }
    });
});

angular.module("currentApp").controller('ProductImageModalCtrl', function ($scope, $http, $uibModalInstance, UploadCtrl, parans) {

    if (parans) {
        $scope.fileName = "";       

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
            $scope.imageDescription = parans.imageEdit.imageDescription;
            $scope.idcActive = parans.imageEdit.idcActive;            
            $scope.isEdit = true;
        } else {
            $scope.isFind = parans.isFind;
            $scope.isEdit = false;
        }
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmProductImage) {
        frmProductImage.fileName = $scope.fileName;
        $uibModalInstance.close(frmProductImage);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});

angular.module("currentApp").controller('ImageVisualizationModelCtrl', function ($scope, $http, $uibModalInstance, parans) {
    
    if (parans) {
        
        var getImageData = function (http) {
            return http.get('/basicregistration/products/images/getImageData', { params: { image: parans.image } });
        };

        getImageData($http).then(function (res) {
            if (res) {
                if (res.data.filename) {
                    $scope.filename = res.data.filename;
                } else {
                    console.error(res.data.message);
                }
            }
        });
    }
});
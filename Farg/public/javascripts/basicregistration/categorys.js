
angular.module("currentApp").controller("tblCategorys", function ($scope, $http, $uibModal) {
    const pagerCategoryId = 'pgCategory';

    $scope.dtCategory = new $scope.ObjectDataSource('dtCategory', $scope, '/basicregistration/categorys/getCategorysList', pagerCategoryId);

    /*Modo Edição*/
    $scope.editCategorys = function (category) {
        if (category) {
            $scope.selectedCategory = category;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myCategory.html',
                controller: 'CategoryModalCtrl',
                resolve: {
                    parans: function () {
                        return {
                            isFind: false,
                            categoryEdit: $scope.selectedCategory,
                            title: 'Editar Categoria'
                        };
                    }
                }
            });

            $scope.modalInstance.result.then(function (categoryToUpdate) {
                if (categoryToUpdate) {
                    var _category = {
                        code: categoryToUpdate.iptCode.$modelValue,
                        categoryName: categoryToUpdate.iptCategoryName.$modelValue,
                        idcActive: categoryToUpdate.dbStatus.$modelValue
                    };

                    $scope.post('/basicregistration/categorys/updateCategory', {
                        category: _category
                    },
                        function (res) {
                            $scope.showMessageUser({
                                message: res.data.message,
                                type: res.data.type
                            });
                            //$scope.dataBind();
                            $scope.dtCategory.dataBind();
                        });
                }
            });

            $scope.selectedCategory = undefined;
        }
    };
    /*Modo novo*/
    $scope.newCategorys = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myCategory.html',
            controller: 'CategoryModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: false,
                        title: 'Cadastrar Categoria'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (categoryToInsert) {
            if (categoryToInsert) {
                var _category = {
                    code: categoryToInsert.iptCode.$modelValue,
                    categoryName: categoryToInsert.iptCategoryName.$modelValue,
                    idcActive: categoryToInsert.dbStatus.$modelValue
                };

                $scope.post('/basicregistration/categorys/insertCategory',
                    {
                        category: _category
                    }, function (response) {
                        $scope.showMessageUser({
                            message: response.data.message,
                            type: response.data.type
                        });
                        //$scope.dataBind();
                        $scope.dtCategory.dataBind();
                    });

                $scope.dtCategory.cancelFilters();
            }
        });
    };
    /*Modo Busca*/
    $scope.findCategorys = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myCategory.html',
            controller: 'CategoryModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: true,
                        title: 'Procurar'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (categoryToFind) {
            if (categoryToFind) {
                var _filter = {
                    code: categoryToFind.iptCode.$modelValue,
                    categoryName: categoryToFind.iptCategoryName.$modelValue,
                    idcActive: categoryToFind.dbStatus.$modelValue
                };

                $scope.dtCategory.setFilters(_filter);
                $scope.dtCategory.dataBind();
            }
        });
    };

    $scope.deleteCategorys = function (category) {
        $scope.post('/basicregistration/categorys/deleteCategory',
            {
                category: category
            }, function (response) {
                $scope.showMessageUser({
                    message: response.data.message,
                    type: response.data.type
                });

                $scope.dtCategory.dataBind();
            });
    };

    $scope.addPager(pagerCategoryId, {
        changedCallback: $scope.dtCategory.dataBind
    });

    $scope.dtCategory.dataBind();
});

angular.module("currentApp").controller('CategoryModalCtrl', function ($scope, $http, $uibModalInstance, parans) {

    if (parans) {

        var getCategoryStatusOptions = function (http) {
            return http.get('/basicregistration/categorys/getCategoryStatusOptions');
        };

        getCategoryStatusOptions($http).then(function (res) {
            $scope.statusOptions = res.data;
        });

        $scope.isFind = false;
        $scope.isEdit = false;
        $scope.titleModal = parans.title;

        if (parans.categoryEdit) {
            $scope.code = parans.categoryEdit.code,
            $scope.categoryName = parans.categoryEdit.categoryName,
            $scope.idcActive = parans.categoryEdit.idcActive
            $scope.isEdit = true;
        } else {
            $scope.isFind = parans.isFind;
            $scope.isEdit = false;
        }
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmCategory) {
        $uibModalInstance.close(frmCategory);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
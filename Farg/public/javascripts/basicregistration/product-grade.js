
angular.module("currentApp").controller("tblProductGrade", function ($scope, Utils, $uibModal, TabManager) {
    const pagerProductGradeId = 'pgProductGrade';

    $scope.dtProductGrade = new $scope.ObjectDataSource('dtProductGrade', $scope, '/basicregistration/grades/products/getGradesList', pagerProductGradeId);

    $scope.dtProductGrade.onSelecting = function (parans) {
        parans.gradeCode = TabManager.getDataKey('gradeCode');
    };

    //No momento em que houver a seleção desta tab recarrega os dados
    TabManager.onChangeSelection(function () {
        $scope.dtProductGrade.dataBind();
    });

    /*Modo Busca*/
    $scope.findStatus = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myProductGrade.html',
            controller: 'ProductGradeModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: true,
                        title: 'Procurar'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (productGradeToFind) {
            if (productGradeToFind) {
                var _filter = {
                    idcEnable: productGradeToFind.$modelValue.checked
                };

                $scope.dtProductGrade.setFilters(_filter);
                $scope.dtProductGrade.dataBind();
            }
        });
    };    

    $scope.updateStatus = function (grade) {
        Utils.post('/basicregistration/grades/products/updateStatus', {
            productGrade: {
                productCode: grade.productCode,
                gradeCode: grade.gradeCode,
                idcEnable: $scope.getValue(grade.idcEnable) ? false : true
            }
        }, function (res) {
            if(res.data)
                Utils.toMessage(res.data.message, res.data.type);
        });
    };

    $scope.getValue = function (value) {
        return value === 'S' ? true : false;
    };

    $scope.addPager(pagerProductGradeId, {
        changedCallback: $scope.dtProductGrade.dataBind
    });    
});

angular.module("currentApp").controller('ProductGradeModalCtrl', function ($scope, $http, $uibModalInstance, parans) {

    if (parans) {
        
        $scope.titleModal = parans.title;
                
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmGrade) {
        $uibModalInstance.close(frmGrade);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});

angular.module("currentApp").controller("tblRequestItems", function ($scope, $http, $uibModal, TabManager, Utils) {
    const pagerRequestItemsId = 'pgRequestItems';

    $scope.dtRequestItems = new $scope.ObjectDataSource('dtRequestItems', $scope, '/consult/request/items/getRequestItemsList', pagerRequestItemsId);
    $scope.dtRequestItems.onSelecting = function (parans) {
        parans.requestCode = TabManager.getDataKey('code');
        parans.clientCode = TabManager.getDataKey('clientCode');
    };

    //No momento em que houver a seleção desta tab recarrega os dados
    TabManager.onChangeSelection(function () {
        $scope.dtRequestItems.dataBind();
    });
    
    /*Modo Busca*/
    $scope.findItem = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myItemRequest.html',
            controller: 'RequestItemsModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: true,
                        title: 'Procurar'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (itemToFind) {
            if (itemToFind) {
                var _filter = {
                    requestCode: TabManager.getDataKey('code'),
                    clientCode: TabManager.getDataKey('clientCode'),
                    code: itemToFind.iptCode.$modelValue,
                    productCode: itemToFind.iptClientCode.$modelValue,
                    productName: itemToFind.iptClientName.$modelValue,
                    gradeCode: itemToFind.dbGrade.$modelValue
                };

                $scope.dtRequestItems.setFilters(_filter);
                $scope.dtRequestItems.dataBind();
            }
        });
    };

    $scope.toMoney = function (value) {
        return value ? Utils.toMoney(value, 'R$') : null;
    }

    $scope.addPager(pagerRequestItemsId, {
        changedCallback: function () {
            $scope.dtRequestItems.dataBind();
        }
    });
});

angular.module("currentApp").controller('RequestItemsModalCtrl', function ($scope, Utils, $uibModalInstance, parans) {

    if (parans) {       

        Utils.get('/client/products/getGradesOptions', null, function (res) {
            if (res.data) {
                $scope.gradeOptions = res.data.result;
            }
        });
        
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmRequestItem) {
        $uibModalInstance.close(frmRequestItem);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
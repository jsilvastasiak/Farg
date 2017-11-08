angular.module("currentApp").controller("tblRequest", function ($scope, Utils, $uibModal, TabManager) {
    const pagerRequestId = 'pgRequest';
    //Variável se tela poderá ser editada
    $scope.canEdit = false;
    $scope.dtRequest = new $scope.ObjectDataSource('dtRequest', $scope, '/consult/request/getRequestList', pagerRequestId);

    $scope.dtRequest.addOnDataBound(function () {
        TabManager.clearDataKeys();
        TabManager.clearTabRef('Request');
    });
       
    /*Modo Busca*/
    $scope.findProduct = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myRequest.html',
            controller: 'RequestModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: true,
                        title: 'Procurar'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (requestToFind) {
            if (requestToFind) {
                var _filter = {
                    code: requestToFind.iptCode.$modelValue,
                    clientCode: requestToFind.iptClientCode.$modelValue,
                    clientName: requestToFind.iptClientName.$modelValue,
                    status: requestToFind.dbStatus.$modelValue,
                    paymentFormCode: requestToFind.dbPaymentForm.$modelValue,
                    requestDate: requestToFind.iptRequestDate.$modelValue                    
                };

                $scope.dtRequest.setFilters(_filter);
                $scope.dtRequest.dataBind();
            }
        });
    };       

    //ao clicar em qualquer linha da tabela, habilita aba de endereços
    $scope.tblRequest_OnSelectedRow = function (request) {
        TabManager.setDataKey('code', request.code);
        TabManager.setDataKey('clientCode', request.clientCode);
        TabManager.enableChildrenTabs('Request');
    }

    $scope.statusChanged = function (request) {
        Utils.post('/consult/request/updateRequest', {
            request: {
                code: request.code,
                clientCode: request.clientCode,
                status: request.status,
                statusDesc: $scope.getStatusDesc(request.status)
            }
        }, function (res) {
            Utils.toMessage(res.data.message, res.data.type);
        });
    };

    $scope.getStatusDesc = function (status) {
        var filter = $scope.statusOptions.filter(function (el) {
            return el.domainValue === status;
        });

        return filter.length > 0 ? filter[0].domainMeaning : null;
    };

    $scope.addPager(pagerRequestId, {
        changedCallback: $scope.dtRequest.dataBind
    });
        
    $scope.dtRequest.dataBind();
    //Pega lista de status
    Utils.get('/consult/request/getRequestStatusOptions', null, function (res) {
        if (res.data) {
            $scope.statusOptions = res.data;
        }
    });

    Utils.get('/consult/request/getCanEdit', null, function (res) {
        if (res.data) {
            $scope.canEdit = res.data.canEdit;
        }
    });
});

angular.module("currentApp").controller('RequestModalCtrl', function ($scope, Utils, $uibModalInstance, parans) {

    if (parans) {

        Utils.get('/consult/request/getRequestStatusOptions', null, function (res) {
            if (res.data) {
                $scope.statusOptions = res.data;
            }
        });

        Utils.get('/client/products/getPaymentFormOptions', null, function (res) {
            if (res.data) {
                $scope.paymentFormOptions = res.data.result;
            }
        });        
                
        $scope.titleModal = parans.title;
                
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmRequest) {
        $uibModalInstance.close(frmRequest);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
angular.module('currentApp').controller("tabManager", function ($scope, TabManager) {
            
    TabManager.addTab({
        name: 'General',
        controller: 'tblClient'
    });
    TabManager.addTab({
        name: 'Address',
        tabFather: 'General',
        status: false,
        controller: 'tblAddress'
    });

    $scope.TabManager = TabManager;

    $scope.onSelect = function () {
        TabManager.ChangedSelection();
    }
});

angular.module("currentApp").controller("tblClient", function ($scope, $http, $uibModal, TabManager) {
    const pagerClientId = 'pgUsers';
    $scope.dtClient = new $scope.ObjectDataSource('dtClient', $scope, '/basicregistration/clients/getClientList', pagerClientId);    
    
    $scope.dtClient.addOnDataBound(function () {
        TabManager.clearDataKeys();
        TabManager.clearTabRef('General');
    });

    /*Modo Edição*/
    $scope.editClient = function (client) {
        if (client) {
            $scope.selectedClient = client;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myClient.html',
                controller: 'ModalCtrl',
                resolve: {
                    parans: function () {
                        return {
                            isFind: false,
                            clientEdit: $scope.selectedClient,
                            title: 'Editar Cliente'
                        };
                    }
                }
            });

            $scope.modalInstance.result.then(function (clientToUpdate) {
                if (clientToUpdate) {
                    var _client = {
                        code: clientToUpdate.iptCode.$modelValue,
                        clientName: clientToUpdate.iptClientName.$modelValue,
                        personType: clientToUpdate.chPersonType.$modelValue,
                        cnpjNumber: $scope.getValueOrDefault(clientToUpdate.iptCnpj.$modelValue),
                        cpfNumber: $scope.getValueOrDefault(clientToUpdate.iptCpf.$modelValue),
                        discountValue: $scope.getValueOrDefault(clientToUpdate.iptDiscountValue.$modelValue)
                    };

                    $scope.post('/basicregistration/clients/updateClient', {
                        client: _client
                    },
                        function (res) {
                            $scope.showMessageUser({
                                message: res.data,
                                type: 'success'
                            });
                            //$scope.dataBind();
                            $scope.dtClient.dataBind();
                        });
                }
            });

            $scope.selectedClient = undefined;
        }
    };
    /*Modo novo*/
    $scope.newClient = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myClient.html',
            controller: 'ModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: false,
                        title: 'Cadastrar Cliente'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (clientToInsert) {
            if (clientToInsert) {
                var _client = {
                    code: clientToInsert.iptCode.$modelValue,
                    clientName: clientToInsert.iptClientName.$modelValue,
                    personType: clientToInsert.chPersonType.$modelValue,
                    cnpjNumber: $scope.getValueOrDefault(clientToInsert.iptCnpj.$modelValue),
                    cpfNumber: $scope.getValueOrDefault(clientToInsert.iptCpf.$modelValue),
                    discountValue: $scope.getValueOrDefault(clientToInsert.iptDiscountValue.$modelValue),
                    email: clientToInsert.iptEmail.$modelValue
                };

                $scope.post('/basicregistration/clients/insertClient',
                    {
                        client: _client
                    }, function (response) {
                        $scope.showMessageUser({
                            message: response.data,
                            type: 'success'
                        });
                        //$scope.dataBind();
                        $scope.dtClient.dataBind();
                    });

                $scope.dtClient.cancelFilters();
            }
        });
    };
    /*Modo Busca*/
    $scope.findClient = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myClient.html',
            controller: 'ModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: true,
                        title: 'Procurar'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (clientToFind) {
            if (clientToFind) {
                var _filter = {
                    code: clientToFind.iptCode.$modelValue,
                    clientName: clientToFind.iptClientName.$modelValue,
                    personType: clientToFind.chPersonType.$modelValue,
                    cnpjNumber: $scope.getValueOrDefault(clientToFind.iptCnpj.$modelValue),
                    cpfNumber: $scope.getValueOrDefault(clientToFind.iptCpf.$modelValue),
                    discountValue: $scope.getValueOrDefault(clientToFind.iptDiscountValue.$modelValue),
                    email: clientToFind.iptEmail.$modelValue,
                    registerDate: $scope.getValueOrDefault(clientToFind.iptRegisterDate.$modelValue),
                    clientUserCode: clientToFind.iptUserCode.$modelValue
                };

                $scope.dtClient.setFilters(_filter);
                $scope.dtClient.dataBind();
            }
        });
    };

    $scope.deleteClient = function (client) {
        $scope.post('/basicregistration/clients/deleteClient',
            {
                client: client
            }, function (response) {
                $scope.showMessageUser({
                    message: response.data.message,
                    type: response.data.type
                });

                $scope.dtClient.dataBind();
            });
    };

    //ao clicar em qualquer linha da tabela, habilita aba de endereços
    $scope.tblClient_OnSelectedRow = function (client) {
        TabManager.setDataKey('clientCode', client.code);
        TabManager.enableChildrenTabs('General');
    }

    /*Recupera do pager na página*/
    $scope.getClientPager = function () {
        return $scope.getPagerInfo(pagerClientId).info;
    };

    $scope.addPager(pagerClientId, {
        changedCallback: $scope.dtClient.dataBind
    });


    $scope.dtClient.dataBind();

});

angular.module("currentApp").controller('ModalCtrl', function ($scope, $http, $uibModalInstance, parans) {

    if (parans) {
        $scope.isFind = false;
        $scope.isEdit = false;
        $scope.titleModal = parans.title;

        if (parans.clientEdit) {
            $scope.code = parans.clientEdit.code;
            $scope.clientName = parans.clientEdit.clientName;
            $scope.personType = parans.clientEdit.personType;
            $scope.cpfNumber = parans.clientEdit.cpfNumber
            $scope.cnpjNumber = parans.clientEdit.cnpjNumber;
            $scope.email = parans.clientEdit.email;
            $scope.discountValue = parans.clientEdit.discountValue;
            $scope.registerDate = parans.clientEdit.registerDate;
            $scope.clientUserCode = parans.clientEdit.clientUserCode;
            $scope.isEdit = true;
        } else {
            $scope.personType = "J";
            $scope.isFind = parans.isFind;
            $scope.isEdit = false;
        }
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmClient) {
        $uibModalInstance.close(frmClient);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});

angular.module("currentApp").directive('clientAddress', function () {
    return {
        templateUrl: '/basicregistration/clients/address/client-address'
    }
});

angular.module("currentApp").directive('clientControl', function () {
    return {
        templateUrl: '/basicregistration/clients/client-control'
    }
});
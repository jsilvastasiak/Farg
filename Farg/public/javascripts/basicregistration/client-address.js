
angular.module("currentApp").controller("tblAddress", function ($scope, $http, $uibModal, TabManager) {
    const pagerClientAddressId = 'pgClientAddress';
    
    $scope.dtClientAddress = new $scope.ObjectDataSource('dtClientAddress', $scope, '/basicregistration/clients/address/getAddressList', pagerClientAddressId);
    $scope.dtClientAddress.onSelecting = function (parans) {
        parans.clientCode = TabManager.getDataKey('clientCode');
    };

    //No momento em que houver a seleção desta tab recarrega os dados
    TabManager.onChangeSelection(function () {
        $scope.dtClientAddress.dataBind();
    });
    /*Modo Edição*/
    $scope.editAddress = function (address) {
        if (address) {
            $scope.selectedAddress = address;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myAddress.html',
                controller: 'AddressClientModalCtrl',
                resolve: {
                    parans: function () {
                        return {
                            isFind: false,
                            addressEdit: $scope.selectedAddress,
                            title: 'Editar Endereço'
                        };
                    }
                }
            });

            $scope.modalInstance.result.then(function (addressToUpdate) {
                if (addressToUpdate) {
                    var _address = {
                        clientCode: TabManager.getDataKey('clientCode'),
                        addressCode: addressToUpdate.iptCode.$modelValue,
                        addressType: addressToUpdate.dbAddressType.$modelValue,
                        cepNumber: $scope.getValueOrDefault(addressToUpdate.iptCepNumber.$modelValue),
                        uf: addressToUpdate.iptUf.$modelValue,
                        cityName: addressToUpdate.iptCityName.$modelValue,
                        districtName: addressToUpdate.iptDistrict.$modelValue,
                        streetName: addressToUpdate.iptStreet.$modelValue,
                        streetNumber: addressToUpdate.iptStreetNumber.$modelValue,
                        compAddress: $scope.getValueOrDefault(addressToUpdate.iptCompAddress.$modelValue),
                        priDDDNumber: $scope.getValueOrDefault(addressToUpdate.iptPriDDDNumber.$modelValue),
                        priFoneNumber: $scope.getValueOrDefault(addressToUpdate.iptPriFoneNumber.$modelValue),
                        secDDDNumber: $scope.getValueOrDefault(addressToUpdate.iptSecDDDNumber.$modelValue),
                        secFoneNumber: $scope.getValueOrDefault(addressToUpdate.iptSecFoneNumber.$modelValue),
                        celDDDNumber: $scope.getValueOrDefault(addressToUpdate.iptCelDDDNumber.$modelValue),
                        celFoneNumber: $scope.getValueOrDefault(addressToUpdate.iptCelFoneNumber.$modelValue)
                    };

                    $scope.post('/basicregistration/clients/address/updateAddress', {
                        address: _address
                    },
                        function (res) {
                            $scope.showMessageUser({
                                message: res.data.message,
                                type: res.data.type
                            });
                            //$scope.dataBind();
                            $scope.dtClientAddress.dataBind();
                        });
                }
            });

            $scope.selectedAddress = undefined;
        }
    };
    /*Modo novo*/
    $scope.newAddress = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myAddress.html',
            controller: 'AddressClientModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: false,
                        title: 'Cadastrar Endereço'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (addressToInsert) {
            if (addressToInsert) {
                var _address = {
                    clientCode: TabManager.getDataKey('clientCode'),
                    addressType: addressToInsert.dbAddressType.$modelValue,
                    cepNumber: $scope.getValueOrDefault(addressToInsert.iptCepNumber.$modelValue),
                    uf: addressToInsert.iptUf.$modelValue,
                    cityName: addressToInsert.iptCityName.$modelValue,
                    districtName: addressToInsert.iptDistrict.$modelValue,
                    streetName: addressToInsert.iptStreet.$modelValue,
                    streetNumber: addressToInsert.iptStreetNumber.$modelValue,
                    compAddress: $scope.getValueOrDefault(addressToInsert.iptCompAddress.$modelValue),
                    priDDDNumber: $scope.getValueOrDefault(addressToInsert.iptPriDDDNumber.$modelValue),
                    priFoneNumber: $scope.getValueOrDefault(addressToInsert.iptPriFoneNumber.$modelValue),
                    secDDDNumber: $scope.getValueOrDefault(addressToInsert.iptSecDDDNumber.$modelValue),
                    secFoneNumber: $scope.getValueOrDefault(addressToInsert.iptSecFoneNumber.$modelValue),
                    celDDDNumber: $scope.getValueOrDefault(addressToInsert.iptCelDDDNumber.$modelValue),
                    celFoneNumber: $scope.getValueOrDefault(addressToInsert.iptCelFoneNumber.$modelValue)
                };

                $scope.post('/basicregistration/clients/address/insertAddress',
                    {
                        address: _address
                    }, function (response) {
                        $scope.showMessageUser({
                            message: response.data.message,
                            type: response.data.type
                        });
                        //$scope.dataBind();
                        $scope.dtClientAddress.dataBind();
                    });

                $scope.dtClientAddress.cancelFilters();
            }
        });
    };
    /*Modo Busca*/
    $scope.findAddress = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myAddress.html',
            controller: 'AddressClientModalCtrl',
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
                    clientCode: TabManager.getDataKey('clientCode'),
                    addressCode: clientToFind.iptCode.$modelValue,
                    addressType: clientToFind.dbAddressType.$modelValue,
                    cepNumber: $scope.getValueOrDefault(clientToFind.iptCepNumber.$modelValue),
                    uf: clientToFind.iptUf.$modelValue,
                    cityName: clientToFind.iptCityName.$modelValue,
                    districtName: clientToFind.iptDistrict.$modelValue,
                    streetName: clientToFind.iptStreet.$modelValue,
                    streetNumber: clientToFind.iptStreetNumber.$modelValue,
                    compAddress: $scope.getValueOrDefault(clientToFind.iptCompAddress.$modelValue),
                    priDDDNumber: $scope.getValueOrDefault(clientToFind.iptPriDDDNumber.$modelValue),
                    priFoneNumber: $scope.getValueOrDefault(clientToFind.iptPriFoneNumber.$modelValue),
                    secDDDNumber: $scope.getValueOrDefault(clientToFind.iptSecDDDNumber.$modelValue),
                    secFoneNumber: $scope.getValueOrDefault(clientToFind.iptSecFoneNumber.$modelValue),
                    celDDDNumber: $scope.getValueOrDefault(clientToFind.iptCelDDDNumber.$modelValue),
                    celFoneNumber: $scope.getValueOrDefault(clientToFind.iptCelFoneNumber.$modelValue)
                };

                $scope.dtClientAddress.setFilters(_filter);
                $scope.dtClientAddress.dataBind();
            }
        });
    };

    $scope.deleteAddress = function (address) {
        $scope.post('/basicregistration/clients/address/deleteAddress',
            {
                address: address
            }, function (response) {
                $scope.showMessageUser({
                    message: response.data.message,
                    type: response.data.type
                });

                $scope.dtClientAddress.dataBind();
            });
    };
    
    $scope.addPager(pagerClientAddressId, {
        changedCallback: function () {
            $scope.dtClientAddress.dataBind();
        }
    });    
});

angular.module("currentApp").controller('AddressClientModalCtrl', function ($scope, $http, $uibModalInstance, parans) {

    if (parans) {

        var getAddressTypeOptions = function (http) {
            return http.get('/basicregistration/clients/address/getAddressTypeOptions');
        };

        getAddressTypeOptions($http).then(function (res) {
            $scope.addressTypeOptions = res.data;
        });

        $scope.isFind = false;
        $scope.isEdit = false;
        $scope.titleModal = parans.title;

        if (parans.addressEdit) {
            $scope.addressType = parans.addressEdit.addressType;
            $scope.addressCode = parans.addressEdit.addressCode;
            $scope.cepNumber = parans.addressEdit.cepNumber;
            $scope.uf = parans.addressEdit.uf;
            $scope.cityName = parans.addressEdit.cityName;
            $scope.districtName = parans.addressEdit.districtName;
            $scope.streetName = parans.addressEdit.streetName;
            $scope.streetNumber = parans.addressEdit.streetNumber;
            $scope.compAddress = parans.addressEdit.compAddress;
            $scope.priDDDNumber = parans.addressEdit.priDDDNumber;
            $scope.priFoneNumber = parans.addressEdit.priFoneNumber;
            $scope.secDDDNumber = parans.addressEdit.secDDDNumber;
            $scope.secFoneNumber = parans.addressEdit.secFoneNumber;
            $scope.celDDDNumber = parans.addressEdit.celDDDNumber;
            $scope.celFoneNumber = parans.addressEdit.celFoneNumber;
            $scope.isEdit = true;
        } else {
            $scope.isFind = parans.isFind;
            $scope.isEdit = false;
        }
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmAddress) {
        $uibModalInstance.close(frmAddress);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };

    $scope.findCep = function (iptCep) {
        if (iptCep.$modelValue && iptCep.$modelValue.length == 8) {
            //Webservice correio para encontrar endereço consultado cep
            const webService = "http://viacep.com.br/ws/{0}/json";
            var path = webService.replace('{0}', iptCep.$modelValue);
            $http.get(path).then(function (response) {
                if (response && response.data) {
                    $scope.uf = response.data.uf;
                    $scope.cityName = response.data.localidade;
                    $scope.districtName = response.data.bairro;
                    $scope.streetName = response.data.logradouro + response.data.complemento;
                }
            }, function (res) {
                window.alert(res.message);

                return null;
            });           
        }
    };
});
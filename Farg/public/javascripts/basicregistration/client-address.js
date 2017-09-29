
angular.module("currentApp").controller("tblAddress", function ($scope, $http, $uibModal, TabManager) {
    const pagerClientAddressId = 'pgClientAddress';
    
    $scope.dtClientAddress = new $scope.ObjectDataSource('dtClientAddress', $scope, '/basicregistration/clients/address/getAddressList', pagerClientAddressId);
    $scope.dtClientAddress.onSelecting = function (parans) {
        parans.clientCode = TabManager.getDataKey('clientCode');
    };

    $scope.loadData = function () {
        $scope.dtClientAddress.dataBind();
    };

    TabManager.onChangeSelection($scope.loadData);

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
                        addressType: addressToUpdate.iptAddressType.$modelValue,
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
                                message: res.data,
                                type: 'success'
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
                    addressType: addressToUpdate.iptAddressType.$modelValue,
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

                $scope.post('/basicregistration/clients/address/insertAddress',
                    {
                        address: _address
                    }, function (response) {
                        $scope.showMessageUser({
                            message: response.data,
                            type: 'success'
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
                    addressType: addressToUpdate.iptAddressType.$modelValue,
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
        changedCallback: $scope.dtClientAddress.dataBind
    });    
});

angular.module("currentApp").controller('AddressClientModalCtrl', function ($scope, $http, $uibModalInstance, parans) {

    if (parans) {
        $scope.isFind = false;
        $scope.isEdit = false;
        $scope.titleModal = parans.title;

        if (parans.addressEdit) {
            $scope.addressType = parans.addressEdit.addressType;
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
});
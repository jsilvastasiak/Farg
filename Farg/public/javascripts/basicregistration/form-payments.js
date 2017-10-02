
angular.module("currentApp").controller("tblFormPayments", function ($scope, $http, $uibModal) {
    const pagerFormPaymentId = 'pgFormPayment';

    $scope.dtFormPayment = new $scope.ObjectDataSource('dtFormPayment', $scope, '/basicregistration/form-payments/getFormPaymentsList', pagerFormPaymentId);

    /*Modo Edição*/
    $scope.editFormPayment = function (formPayment) {
        if (formPayment) {
            $scope.selectedFormPayment = formPayment;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myFormPayment.html',
                controller: 'FormPaymentModalCtrl',
                resolve: {
                    parans: function () {
                        return {
                            isFind: false,
                            formPaymentEdit: $scope.selectedFormPayment,
                            title: 'Editar Forma Pagamento'
                        };
                    }
                }
            });

            $scope.modalInstance.result.then(function (formPaymentToUpdate) {
                if (formPaymentToUpdate) {
                    var _formPayment = {
                        code: formPaymentToUpdate.iptCode.$modelValue,
                        descForm: formPaymentToUpdate.iptDescForm.$modelValue,
                        discountValue: $scope.getValueOrDefault(formPaymentToUpdate.iptDiscountValue.$modelValue),                        
                        idcActive: formPaymentToUpdate.dbStatus.$modelValue
                    };

                    $scope.post('/basicregistration/form-payments/updateFormPayment', {
                        formPayment: _formPayment
                    },
                        function (res) {
                            $scope.showMessageUser({
                                message: res.data.message,
                                type: res.data.type
                            });
                            //$scope.dataBind();
                            $scope.dtFormPayment.dataBind();
                        });
                }
            });

            $scope.selectedFormPayment = undefined;
        }
    };
    /*Modo novo*/
    $scope.newFormPayment = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myFormPayment.html',
            controller: 'FormPaymentModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: false,
                        title: 'Cadastrar Forma Pagamento'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (formPaymentToInsert) {
            if (formPaymentToInsert) {
                var _formPayment = {
                    code: formPaymentToInsert.iptCode.$modelValue,
                    descForm: formPaymentToInsert.iptDescForm.$modelValue,
                    discountValue: $scope.getValueOrDefault(formPaymentToInsert.iptDiscountValue.$modelValue),
                    idcActive: formPaymentToInsert.dbStatus.$modelValue
                };

                $scope.post('/basicregistration/form-payments/insertFormPayment',
                    {
                        formPayment: _formPayment
                    }, function (response) {
                        $scope.showMessageUser({
                            message: response.data.message,
                            type: response.data.type
                        });
                        //$scope.dataBind();
                        $scope.dtFormPayment.dataBind();
                    });

                $scope.dtFormPayment.cancelFilters();
            }
        });
    };
    /*Modo Busca*/
    $scope.findFormPayment = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myFormPayment.html',
            controller: 'FormPaymentModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: true,
                        title: 'Procurar'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (formPaymentToFind) {
            if (formPaymentToFind) {
                var _filter = {
                    code: formPaymentToFind.iptCode.$modelValue,
                    descForm: formPaymentToFind.iptDescForm.$modelValue,
                    discountValue: $scope.getValueOrDefault(formPaymentToFind.iptDiscountValue.$modelValue),
                    idcActive: formPaymentToFind.dbStatus.$modelValue
                };

                $scope.dtFormPayment.setFilters(_filter);
                $scope.dtFormPayment.dataBind();
            }
        });
    };

    $scope.deleteFormPayment = function (formPayment) {
        $scope.post('/basicregistration/form-payments/deleteFormPayment',
            {
                formPayment: formPayment
            }, function (response) {
                $scope.showMessageUser({
                    message: response.data.message,
                    type: response.data.type
                });

                $scope.dtFormPayment.dataBind();
            });
    };

    $scope.addPager(pagerFormPaymentId, {
        changedCallback: $scope.dtFormPayment.dataBind
    });

    $scope.dtFormPayment.dataBind();
});

angular.module("currentApp").controller('FormPaymentModalCtrl', function ($scope, $http, $uibModalInstance, parans) {

    if (parans) {

        var getFormPaymentStatusOptions = function (http) {
            return http.get('/basicregistration/form-payments/getFormPaymentStatusOptions');
        };

        getFormPaymentStatusOptions($http).then(function (res) {
            $scope.statusOptions = res.data;
        });

        $scope.isFind = false;
        $scope.isEdit = false;
        $scope.titleModal = parans.title;

        if (parans.formPaymentEdit) {
            $scope.code = parans.formPaymentEdit.code,
            $scope.descForm = parans.formPaymentEdit.descForm,
            $scope.discountValue = parans.formPaymentEdit.discountValue,
            $scope.idcActive = parans.formPaymentEdit.idcActive
            $scope.isEdit = true;
        } else {
            $scope.isFind = parans.isFind;
            $scope.isEdit = false;
        }
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmFormPayment) {
        $uibModalInstance.close(frmFormPayment);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
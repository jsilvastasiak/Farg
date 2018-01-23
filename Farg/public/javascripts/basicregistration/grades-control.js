
angular.module("currentApp").controller("tblGrades", function ($scope, $http, $uibModal, TabManager) {
    const pagerGradeId = 'pgGrade';

    $scope.dtGrades = new $scope.ObjectDataSource('dtGrades', $scope, '/basicregistration/grades/getGradesList', pagerGradeId);

    $scope.dtGrades.addOnDataBound(function () {
        TabManager.clearDataKeys();
        TabManager.clearTabRef('Grades');
    });

    /*Modo Edição*/
    $scope.editGrade = function (grade) {
        if (grade) {
            $scope.selectedGrade = grade;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myGrade.html',
                controller: 'GradeModalCtrl',
                resolve: {
                    parans: function () {
                        return {
                            isFind: false,
                            gradeEdit: $scope.selectedGrade,
                            title: 'Editar Grade'
                        };
                    }
                }
            });

            $scope.modalInstance.result.then(function (gradeToUpdate) {
                if (gradeToUpdate) {
                    var _grade = {
                        gradeCode: gradeToUpdate.iptCode.$modelValue,
                        descGrade: gradeToUpdate.iptDescGrade.$modelValue,
                        discountValue: $scope.getValueOrDefault(gradeToUpdate.iptDiscountValue.$modelValue),
                        minQuantity: gradeToUpdate.iptMinQuantity.$modelValue,
                        idcActive: gradeToUpdate.dbStatus.$modelValue
                    };

                    $scope.post('/basicregistration/grades/updateGrade', {
                        grade: _grade
                    },
                        function (res) {
                            $scope.showMessageUser({
                                message: res.data.message,
                                type: res.data.type
                            });
                            //$scope.dataBind();
                            $scope.dtGrades.dataBind();
                        });
                }
            });

            $scope.selectedGrade = undefined;
        }
    };
    /*Modo novo*/
    $scope.newGrade = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myGrade.html',
            controller: 'GradeModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: false,
                        title: 'Cadastrar Grade'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (gradeToInsert) {
            if (gradeToInsert) {
                var _grade = {
                    descGrade: gradeToInsert.iptDescGrade.$modelValue,
                    discountValue: $scope.getValueOrDefault(gradeToInsert.iptDiscountValue.$modelValue),
                    minQuantity: gradeToInsert.iptMinQuantity.$modelValue,
                    idcActive: gradeToInsert.dbStatus.$modelValue
                };

                $scope.post('/basicregistration/grades/insertGrade',
                    {
                        grade: _grade
                    }, function (response) {
                        $scope.showMessageUser({
                            message: response.data.message,
                            type: response.data.type
                        });
                        //$scope.dataBind();
                        $scope.dtGrades.dataBind();
                    });

                $scope.dtGrades.cancelFilters();
            }
        });
    };
    /*Modo Busca*/
    $scope.findGrade = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myGrade.html',
            controller: 'GradeModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: true,
                        title: 'Procurar'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (gradeToFind) {
            if (gradeToFind) {
                var _filter = {
                    gradeCode: gradeToFind.iptCode.$modelValue,
                    descGrade: gradeToFind.iptDescGrade.$modelValue,
                    discountValue: $scope.getValueOrDefault(gradeToFind.iptDiscountValue.$modelValue),
                    minQuantity: gradeToFind.iptMinQuantity.$modelValue,
                    idcActive: gradeToFind.dbStatus.$modelValue
                };

                $scope.dtGrades.setFilters(_filter);
                $scope.dtGrades.dataBind();
            }
        });
    };

    $scope.deleteGrade = function (grade) {
        $scope.post('/basicregistration/grades/deleteGrade',
            {
                grade: grade
            }, function (response) {
                $scope.showMessageUser({
                    message: response.data.message,
                    type: response.data.type
                });

                $scope.dtGrades.dataBind();
            });
    };

    //ao clicar em qualquer linha da tabela, habilita aba de endereços
    $scope.tblGrades_OnSelectedRow = function (grade) {
        TabManager.setDataKey('gradeCode', grade.gradeCode);
        TabManager.enableChildrenTabs('Grades');
    }

    $scope.addPager(pagerGradeId, {
        changedCallback: function () {
            $scope.dtGrades.dataBind();
        }
    });

    $scope.dtGrades.dataBind();
});

angular.module("currentApp").controller('GradeModalCtrl', function ($scope, $http, $uibModalInstance, parans) {

    if (parans) {

        var getGradesStatusOptions = function (http) {
            return http.get('/basicregistration/grades/getGradesStatusOptions');
        };

        getGradesStatusOptions($http).then(function (res) {
            $scope.statusOptions = res.data;
        });

        $scope.isFind = false;
        $scope.isEdit = false;
        $scope.titleModal = parans.title;

        if (parans.gradeEdit) {
            $scope.gradeCode = parans.gradeEdit.gradeCode,
                $scope.descGrade = parans.gradeEdit.descGrade,
                $scope.discountValue = parans.gradeEdit.discountValue,
                $scope.minQuantity = parans.gradeEdit.minQuantity,
                $scope.idcActive = parans.gradeEdit.idcActive
            $scope.isEdit = true;
        } else {
            $scope.isFind = parans.isFind;
            $scope.isEdit = false;
        }
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
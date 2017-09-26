
angular.module("currentApp").controller("tblUsers", function ($scope, $http, $uibModal) {
    const pagerUserId = 'pgUsers';
    $scope.dtUsers = new $scope.ObjectDataSource('dtUsers', $scope, '/basicregistration/users/getUsersList', pagerUserId);
    
    /*Modo Edição*/
    $scope.editUser = function (user) {
        if (user) {
            $scope.selectedUser = user;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myModal.html',
                controller: 'ModalCtrl',
                resolve: {
                    parans: function () {
                        return {
                            isFind: false,
                            userEdit: $scope.selectedUser,
                            title: 'Editar Usuário'
                        };
                    }
                }
            });

            $scope.modalInstance.result.then(function (userToUpdate) {
                if (userToUpdate) {
                    var _user = {
                        code: userToUpdate.iptCode.$modelValue,
                        login: userToUpdate.iptLogin.$modelValue,
                        password: userToUpdate.iptPassword.$modelValue,
                        isAdmin: userToUpdate.chIsAdm.$modelValue,
                        isAgent: userToUpdate.chIsAgent.$modelValue,
                        isClient: userToUpdate.chIsClient.$modelValue,
                        statusUser: userToUpdate.dbStatus.$modelValue
                    };

                    $scope.post('/basicregistration/users/updateUser', {
                            user: _user
                        },
                        function (res) {
                            $scope.showMessageUser({
                                message: res.data,
                                type: 'success'
                            });
                            //$scope.dataBind();
                            $scope.dtUsers.dataBind();
                        });
                }
            });

            $scope.selectedUser = undefined;
        }

    };
    /*Modo novo*/
    $scope.newUser = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myModal.html',
            controller: 'ModalCtrl',
            resolve: {
                parans: function () {
                    return {
                        isFind: false,
                        title: 'Cadastrar Usuário'
                    };
                }
            }
        });

        $scope.modalInstance.result.then(function (userToInsert) {
            if (userToInsert) {
                var _user = {
                    code: userToInsert.iptCode.$modelValue,
                    login: userToInsert.iptLogin.$modelValue,
                    password: userToInsert.iptPassword.$modelValue,
                    isAdmin: userToInsert.chIsAdm.$modelValue,
                    isAgent: userToInsert.chIsAgent.$modelValue,
                    isClient: userToInsert.chIsClient.$modelValue,
                    statusUser: userToInsert.dbStatus.$modelValue
                };

                $scope.post('/basicregistration/users/insertUser',
                    {
                        user: _user
                    }, function (response) {
                        $scope.showMessageUser({
                            message: response.data,
                            type: 'success'
                        });
                        //$scope.dataBind();
                        $scope.dtUsers.dataBind();
                    });

                $scope.dtUsers.cancelFilters();
            }
        });
    };
    /*Modo Busca*/
    $scope.findUser = function () {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'myModal.html',
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

        $scope.modalInstance.result.then(function (userToFind) {
            if (userToFind) {
                var _filter = {
                    code: userToFind.iptCode.$modelValue,
                    login: userToFind.iptLogin.$modelValue,
                    password: userToFind.iptPassword.$modelValue,
                    isAdmin: userToFind.chIsAdm.$modelValue,
                    isAgent: userToFind.chIsAgent.$modelValue,
                    isClient: userToFind.chIsClient.$modelValue,
                    statusUser: userToFind.dbStatus.$modelValue
                };

                $scope.dtUsers.setFilters(_filter);
                $scope.dtUsers.dataBind();
            }
        });
    };

    $scope.deleteUser = function (user) {
        $scope.post('/basicregistration/users/deleteUser',
            {
                user: user
            }, function (response) {
                $scope.showMessageUser({
                    message: response.data,
                    type: 'success'
                });
                
                $scope.dtUsers.dataBind();
            });
    };

    /*Recupera do pager na página*/
    $scope.getUserPager = function () {
        return $scope.getPagerInfo(pagerUserId).info;
    };

    $scope.addPager(pagerUserId, {
        changedCallback: $scope.dtUsers.dataBind
    });
    
    $scope.dtUsers.dataBind();
});

angular.module("currentApp").controller('ModalCtrl', function ($scope, $http, $uibModalInstance, parans) {

    if (parans) {
        $scope.isFind = false;
        $scope.isEdit = false;
        $scope.titleModal = parans.title;

        var getUserStatusOptions = function (http) {
            return http.get('/basicregistration/users/getUserStatusOptions');
        };

        getUserStatusOptions($http).then(function (res) {
            $scope.statusOptions = res.data;
        });
    
        if (parans.userEdit) {
            $scope.code = parans.userEdit.code;
            $scope.login = parans.userEdit.login;
            $scope.isAdm = parans.userEdit.isAdmin == 'S' ? true : false;
            $scope.isAgent = parans.userEdit.isAgent == 'S' ? true : false;
            $scope.isClient = parans.userEdit.isClient == 'S' ? true : false;
            $scope.statusUser = parans.userEdit.isActive;
            $scope.isEdit = true;
        } else {
            $scope.isFind = parans.isFind;
            $scope.isEdit = false;
        }
    } else {
        console.log("Modal deve receber parâmetros.");
    }

    $scope.save = function (frmUser) {        
        $uibModalInstance.close(frmUser);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
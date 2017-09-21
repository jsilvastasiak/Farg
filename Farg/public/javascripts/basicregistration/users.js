
angular.module("currentApp").controller("tblUsers", function ($scope, $http, $uibModal) {
    const pagerUserId = 'pgUsers';

    $scope.dataBind = function () {
        $scope.get('/basicregistration/users/getUsersList',
            {
                pagerInfo: $scope.getPagerInfo(pagerUserId)
            },
            function (res) {
                if (res) {
                    $scope.getPagerInfo(pagerUserId).bigTotalItems = res.data.totalItems;
                    $scope.usersList = res.data.result;
                }
            },
            function (err) {
                console.log(err);
            });
    };
    /*Modo Edição*/
    $scope.editUser = function (user) {
        if (user) {
            $scope.selectedUser = user;

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myModal.html',
                controller: 'ModalCtrl',
                resolve: {
                    userEdit: function () {
                        return $scope.selectedUser;
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
                            $scope.dataBind();
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
                userEdit: function () {
                    return undefined;
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
                        $scope.dataBind();
                    });
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
                $scope.dataBind();
            });
    };

    /*Recupera do pager na página*/
    $scope.getUserPager = function () {
        return $scope.getPagerInfo(pagerUserId).info;
    };

    $scope.addPager(pagerUserId, {        
        changedCallback: $scope.dataBind
    });
    $scope.dataBind();
});

angular.module("currentApp").controller('ModalCtrl', function ($scope, $http, $uibModalInstance, userEdit) {

    var getUserStatusOptions = function (http) {
        return http.get('/basicregistration/users/getUserStatusOptions');
    };

    getUserStatusOptions($http).then(function (res) {
        $scope.statusOptions = res.data;
    });
    
    if (userEdit) {
        $scope.code = userEdit.code;
        $scope.login = userEdit.login;
        $scope.isAdm = userEdit.isAdmin == 'S' ? true : false;
        $scope.isAgent = userEdit.isAgent == 'S' ? true : false;
        $scope.isClient = userEdit.isClient == 'S' ? true : false;
        $scope.statusUser = userEdit.isActive;
        $scope.isEdit = true;
    } else {
        $scope.isEdit = false;
    }

    $scope.save = function (frmUser) {        
        $uibModalInstance.close(frmUser);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});
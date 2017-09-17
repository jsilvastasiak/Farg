angular.module("currentApp", ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

angular.module("currentApp").controller("masterCtrl", function ($scope, $http) {
    $scope.messageUser = undefined;
    $scope._alerts = [];
    $scope._listsToPage = [];

    $scope.showMessageUser = function (args) {
        $scope._alerts.push({
            typeMessageUser: args.type,
            messageUser: args.message
        });
    };
    
    $scope.closeMessageUser = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.get = function (path, data, next, nextErr) {        
        $http.get(path, data).then(function (res) {
            next(res);
        }).catch(function (res) {
            $scope.showMessageUser({
                message: res.data,
                type: 'danger'
            });
            nextErr(res.data);
        });
    };

    $scope.post = function (path, data, next, nextErr) {
        $http.post(path, data).then(function (res) {
            if(next)
                next(res);
        }).catch(function (res) {
            $scope.showMessageUser({
                message: res.data,
                type: 'danger'
            });
            if (nextErr)
                nextErr(res.data);
        });
    };

    /*Adiciona informações de paginador*/
    $scope.addPager = function (id, next) {
        var pager = {           
            maxSize: 5,
            bigTotalItems: 1000,
            bigCurrentPage: 1,
            numPages: 30
        };

        $scope._listsToPage.push({
            id: id,
            info: pager,
            //Método para ser chamado após alterações no paginador
            next: next
        });
    };

    /*Seleciona pager pelo id*/
    $scope._getPager = function (idPager) {
        var filter = $scope._listsToPage.filter(function (el) {
            return el["id"] = idPager;
        });

        if (filter)
            return filter[0];
        else {
            $scope.showMessageUser({
                message: 'Pager ' + idPager + ' não está registrado nesta página',
                type: 'danger'
            });
        }       
    };

    /*Pega informações da instância paginador*/
    $scope.getPagerInfo = function (id) {
        return $scope._getPager(id).info;
    };

    /*Se um paginador for mudado a página, seleciona a instância do mesmo e chama processos
    de busca das informações no servidor
    */
    $scope.pageChanged = function (idPager) {
        var pager = $scope._getPager(idPager);
                
        pager.next();
    }
});
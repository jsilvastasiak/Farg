angular.module("currentApp", ['ngAnimate', 'ngSanitize', 'ui.bootstrap','ngCpfCnpj', 'ui.mask', 'ui.date','ng-currency', 'percentage', 'ng-percent']);

angular.module("currentApp").controller("masterCtrl", function ($scope, $http) {
    $scope.messageUser = undefined;
    $scope._alerts = [];
    $scope._listsToPage = [];
    $scope._datasources = [];
    $scope.itemsPerPage = 30;

    $scope.dateOptions = {
        dateFormat: "dd/mm/yyyy",
        altFormat: "dd/mm/yyyy",
        showButtonPanel: true
    }

    //Implementa a lógica de um objeto que será o datasource das tabelas
    $scope.ObjectDataSource = function (id, scope, pathReq, pagerId) {
        this._pathReq = pathReq;
        this._pagerId = pagerId;
        this._scope = scope;
        this._id = id;
        this._next = scope._posReqDataSource;
        this._scope._datasources.push({
            id: this._id,
            object: this
        });

        this.List = {};
        this.filters = {};
        this.orderByField = null;
        this.orderByDirection = null;
    };
    $scope.ObjectDataSource.prototype = {
        dataBind: function () {
            this._scope.get(this._pathReq,
                {
                    datasourceId: this._id,
                    pagerInfo: this._scope.getPagerInfo(this._pagerId),
                    filters: this.filters,
                    orderByField: this.orderByField,
                    orderByDirection: this.orderByDirection
                },
                this._next,                
                function (err) {
                    console.log(err);
                });
        },
        getScope: function () {
            return this._scope;
        },
        getPagerId: function () {
            return this._pagerId;
        },
        setList: function (data) {
            this.List = data;
        },
        setFilters: function (filter) {
            this.filters = filter;
        },
        getFilters: function () {
            return this.filters;
        },
        cancelFilters: function () {
            this.filters = {};
        }
    };
    //Função implementa lógica para receber o retorno das requisições no servidor
    $scope._posReqDataSource = function (res) {
        if (res) {
            var filter = $scope._datasources.filter(function (el) {
                return el["id"] = res.data.datasourceId;
            });

            if (filter.length > 0) {
                var datasource = filter[0].object;

                datasource.getScope().getPagerInfo(datasource.getPagerId()).bigTotalItems = res.data.totalItems;
                datasource.setList(res.data.result);
            }
        }
    };

    $scope.showMessageUser = function (args) {
        $scope._alerts.push({
            typeMessageUser: args.type,
            messageUser: args.message
        });
    };
    
    $scope.closeMessageUser = function (index) {
        $scope._alerts.splice(index, 1);
    };

    $scope.get = function (path, data, next, nextErr) {
        var parameters = data;
        var config = { params: parameters };

        $http.get(path, config).then(function (res) {
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
    $scope.addPager = function (id, parans) {
        var _itemsPerPage = $scope.itemsPerPage;
        var _next = null;

        if (parans) {
            if (parans.itemsPerPage)
                _itemsPerPage = parans.itemsPerPage;
            if (parans.changedCallback)
                _next = parans.changedCallback;
        }

        var pager = {           
            maxSize: 5,
            bigTotalItems: 0,
            bigCurrentPage: 1,
            itemsPerPage: _itemsPerPage
        };

        $scope._listsToPage.push({
            id: id,
            info: pager,
            //Método para ser chamado após alterações no paginador
            next: _next
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
    };

    //Retira problema de undefined das variáveis
    $scope.getValueOrDefault = function (property) {
        if (property) {
            if (typeof property === "object")
                if (property.toLocaleDateString)
                    return property.toLocaleDateString();
                else
                    return property;
            else
                return property;
        }

        return null;
    }
});

angular.module("currentApp").directive('headerGrid', function () {
    return {
        link: function (scope, element, attrs) {            
            var parentDatasource = element.closest('table').attr('ng-model');
            var direction = '';

            if (!parentDatasource) {
                console.log("O header deve possuir uma tabela como pai com um atributo ng-model indicando o datasource da tabela.");
                return null;
            }

            var datasource = scope.$eval(parentDatasource);            
            
            //Cria atributos para controle
            element.attr('orderByField', parentDatasource + ".orderByField");

            attrs.$observe('orderByField', function (value) {
                if (attrs.orderByField != attrs.fieldOrder) {
                    
                }
            });
            
            element.click(function () {
                if (direction === 'asc') {
                    direction = 'desc';
                    element.find('span.asc-direction').removeClass('displayed');
                    element.find('span.desc-direction').addClass('displayed');
                }
                else if (direction === 'desc') {
                    direction = '';
                    element.find('span.desc-direction').removeClass('displayed');
                    element.find('span.asc-direction').removeClass('displayed');
                }
                else if (direction === '') {
                    direction = 'asc';
                    element.find('span.desc-direction').removeClass('displayed');
                    element.find('span.asc-direction').addClass('displayed');
                }

                datasource.orderByField = attrs.fieldOrder;
                datasource.orderByDirection = direction;
                datasource.dataBind();
            });

            var tagA = $('<a>', { href: "#", class: "header-text" }).text(attrs.headerText);
            var spanAsc = $('<span>', { class: 'asc-direction' });
            var spanDesc = $('<span>', { class: 'desc-direction' });
            var mainSpan = $('<span>').append(spanAsc).append(spanDesc);

            tagA.append(mainSpan);
            element.append(tagA);
        }
    }
});

/**
 * Funções de inicialização da página
 */
function Page() {

}

Page.prototype = {
    /**
     * Seta largura automática para container
     */
    setHeightPanel: function() {
        var jq = angular.element(document);

        if (jq.find('nav.navbar').length > 0) {
            var windowHeight = window.innerHeight;
            var menuHeight = jq.find('nav.navbar')[0].offsetHeight;
            //var bodyPadding = parseInt(jq.find('body')[0].style.padding.replace('px',''));
            var containerEl = jq.find('div.panel.panel-default')[0];

            var heightToContainer = windowHeight - menuHeight - 60;

            containerEl.style.height = heightToContainer + "px";
        }
    },

    start: function () {
        this.setHeightPanel();
    }
}

var page = new Page();
window.pageControl = page;
window.onresize = window.pageControl.setHeightPanel;
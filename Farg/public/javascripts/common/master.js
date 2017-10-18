angular.module("currentApp", ['ngAnimate', 'ngTouch', 'ngRoute', 'ngSanitize', 'ui.bootstrap','ngCpfCnpj', 'ui.mask', 'ui.date','ng-currency', 'percentage', 'ng-percent', 'ui.uploader']);

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
        this.onSelecting = null;
        this.onDataBound = [];
    };
    $scope.ObjectDataSource.prototype = {
        dataBind: function () {
            if (this.onSelecting)
                this.onSelecting(this.filters);

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
        },
        addOnDataBound: function (listener) {
            this.onDataBound.push(listener);
        },
        _onDataBoundEvent: function () {
            this.onDataBound.forEach(function (el) {
                el();
            });
        }
    };
    //Função implementa lógica para receber o retorno das requisições no servidor
    $scope._posReqDataSource = function (res) {
        if (res) {
            var filter = $scope._datasources.filter(function (el) {
                return el["id"] === res.data.datasourceId;
            });

            if (filter.length > 0) {
                var datasource = filter[0].object;

                if (datasource.getPagerId())
                    datasource.getScope().getPagerInfo(datasource.getPagerId()).bigTotalItems = res.data.totalItems;
                datasource.setList(res.data.result);

                datasource._onDataBoundEvent();
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
        if(id)
            return $scope._getPager(id).info;
        return null;
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
    },

    /**Formata string na máscar passada*/
    $scope.format = function format(mask, number) {
        var s = '' + (number ? number : ""), r = "";
        for (var im = 0, is = 0; im < mask.length && is < s.length; im++) {
            r += mask.charAt(im) == 'X' ? s.charAt(is++) : mask.charAt(im);
        }
        return r;
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
            if (attrs.width)
                element.attr({ style: 'width: ' + attrs.width + "px" });
            else
                element.attr({ style: 'width: auto' });
        }
    }
});

angular.module("currentApp").directive('selectableRow', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.addClass("selectable-row");
            element.click(function (el) {
                element.closest('tbody').children('tr').removeClass("selected-row");
                $(el.currentTarget).addClass("selected-row");
            });
        }
    }
});

angular.module("currentApp").factory("TabManager", function () {
    var Keys = {};
    var Tabs = [];
    var onChangeListeners = [];
    return {       
        setDataKey: function (keyName, value) {
            Keys[keyName] = value;
        },
        getDataKey: function (keyName) {
            return Keys[keyName];
        },
        clearDataKeys: function () {
            Keys = {};
        },
        addTab: function (options) {
            Tabs.push({
                name: options.name,
                tabFather: options.tabFather ? options.tabFather : null,
                //Se não passar o status, será verificado se a tab tem tab pai, senão é sempre habilitada
                status: options.status ? options.status : options.tabFather ? false : true,
                controller: options.controller
            });
        },
        //Habilita ou desabilita tabs filhas da passada como parâmetro
        _setRefChildrenTabs: function (tabName, status) {
            var childrens = Tabs.filter(function (el) {
                return el["tabFather"] === tabName;
            });

            childrens.forEach(function (el) {
                el["status"] = status;                
            })
        },
        enableChildrenTabs: function (tabName) {
            this._setRefChildrenTabs(tabName, true);
        },
        clearTabRef: function (tabName) {
            this._setRefChildrenTabs(tabName, false);
        },
        getTab: function (tabName) {
            var tab = Tabs.filter(function (el) {
                return el["name"] === tabName;
            });

            if(tab.length > 0)
                return tab[0];
            else {
                var message = 'TabManager ' + id + ' não está registrado no momento de sua chamada.';
                console.log(message);
                return undefined;
            }
        },
        //Eventos para quando seleção das abas for usada
        onChangeSelection: function (listener) {
            onChangeListeners.push(listener);
        },
        ChangedSelection: function () {
            //Chama métodos registrados
            onChangeListeners.forEach(function (el) {
                el();
            })
        }
    }
});

angular.module("currentApp").factory("UploadCtrl", ['uiUploader', '$log', function (uiUploader, $log, $scope) {    
    var files = [];
    return {
        remove_file: function (file) {
            uiUploader.removeFile(file);
        },
        clean_files: function () {
            uiUploader.removeAll();
        },
        upload_file: function () {
            uiUploader.startUpload({
                url: '/temporary/files',
                concurrency: 2,
                onProgress: function (file) {
                    $log.info(file.name + ' ' + file.humanSize);
                }
            });
        },
        get_files: function () {
            return files;
        },
        set_inputField: function (element, options) {            
            if (element) {
                element.change(function (e) {
                    var files = e.target.files;
                    
                    for (var i = 0; i < files.length; i++) {
                        if (options.inputDescription) {
                            options.inputDescription.text(options.inputDescription.text() || files[i].name);
                        }
                    }

                    uiUploader.addFiles(files);
                    files = uiUploader.getFiles();

                    //Verifica se deve começar o upload imediatamente na atualização do campo
                    if (options.startImmediately) {
                        uiUploader.startUpload({
                            url: '/temporary/files',
                            concurrency: 2,
                            onProgress: function (file) {
                                $log.info(file.name + ' ' + file.humanSize);

                                if (options.onProgress) {
                                    options.onProgress(file);
                                }
                            },
                            onCompleted: function (file, res) {
                                if (options.onCompleted) {
                                    if (res)
                                        var response = JSON.parse(res);
                                    options.onCompleted(file, response);
                                }
                            }
                        });
                    }
                });
            } else
                $log.error.error('Elemento ' + id + ' não está presente na página.');
        }
    };
}]);

angular.module("currentApp").factory("Utils", function ($window) {
    return {
        getUrlParameter: function (paramName) {
            var url = new URL($window.location.href);
            return url.searchParams.get(paramName);
        }
    }
});

angular.module("currentApp").directive("uploaderInput", ['UploadCtrl', function (UploadCtrl) {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            element.addClass("input-wrapper");

            var labelDescription = $('<label>', { for: 'input-file' }).text('Selecionar');
            var inputFile = $('<input>', { id: 'input-file', type: 'file', value: '' });
            var span = $('<span>', { id: 'file-name' });

            var divProgress = $('<div>', { style: 'display: none' }).addClass('ng-scope progress-div');
            var progress = $('<progress>', { value: "0", max: "0" });
            divProgress.append(progress);

            element.append(labelDescription).append(inputFile).append(span).append(divProgress);

            //Seta campo como receptor de arquivos
            UploadCtrl.set_inputField(inputFile, {
                inputDescription: span,
                startImmediately: true,
                onProgress: function (file) {
                    divProgress.attr('style', 'display: block');
                    //Seta o progresso do upload
                    progress.attr('max', file.size);
                    progress.attr('value', file.loaded);
                    scope.$apply();
                },
                onCompleted: function (file, response) {
                    divProgress.attr('style', 'display: none');

                    if (attrs.fileName) {
                        scope.fileName = scope.$eval(attrs.fileName);
                        scope.fileName = response.filename;
                    }
                }
            });
        }
    }
}]);

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
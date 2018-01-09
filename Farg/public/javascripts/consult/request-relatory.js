angular.module("relatoryApp", []);

angular.module("relatoryApp").factory("Utils",['$window', '$http', function ($window, $http) {
    
    return {

        URL: function (a) {
            if (a == "") return {};
            var b = {};
            for (var i = 0; i < a.length; i++) {
                var p = a[i].split('=', 2);
                if (p.length == 1)
                    b[p[0]] = "";
                else
                    b[p[0]] = decodeURIComponent(p[1].replace('/\+/g', " "));
            }
            return b;
        }($window.location.search.substr(1).split('&')),

        //Retira problema de undefined das variáveis
        getValueOrDefault: function (property) {
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

        toMoney: function (value, symbol) {
            var newValue = typeof (value) !== "string" ? value.toFixed(2) : value;
            newValue = newValue.replace('.', ',');

            return (symbol ? symbol + " " : "") + newValue;
        },

        /**Formata string na máscar passada*/
        format: function format(mask, number) {
            var s = '' + (number ? number : ""), r = "";
            for (var im = 0, is = 0; im < mask.length && is < s.length; im++) {
                r += mask.charAt(im) == 'X' ? s.charAt(is++) : mask.charAt(im);
            }
            return r;
        }
    }
}]);

angular.module("relatoryApp").controller("requestRelatory", ['$scope', '$http', '$log', 'Utils', function ($scope, $http, $log, Utils) {
    
    var config = {
        params: {
            clientCode: Utils.URL["client"],
            requestCode: Utils.URL["requestCode"]
        }
    };
    
    $http.get("/consult/request/getRequestInfo", config).then(function (res) {
        if (res.data) {
            try {
                var items = res.data.result;
                var maskCnpj = items[0].clientPersonType === "J" ? "CNPJ: XX.XXX.XXX/XXXX-XX" : "CPF: XXX.XXX.XXX-XX";
                var clientAddress = "";
                clientAddress.concat(items[0].clientStreet, ", ", items[0].clientStreetNumber, ", ", items[0].clientDistrict, " - ", items[0].clientCity, " ", items[0].clientUf);
                $scope.request.totalRequest = 0;
                $scope.request.totalItemsRequest = 0;

                $scope.request.code = items[0].code;
                $scope.request.paymentForm = items[0].paymentForm;
                $scope.request.date = (new Date(items[0].data)).toLocaleDateString();
                $scope.request.clientName = items[0].clientName;
                $scope.request.clientCnpjNumber = Utils.format(maskCnpj, items[0].clientCnpjNumber);
                $scope.request.clientAddress = clientAddress;
                $scope.request.clientCity = items[0].clientCity;
                $scope.request.clientUf = items[0].clientUf;
                $scope.request.clientCep = Utils.format("XXXXX-XXXX", items[0].clientCep);
                $scope.request.clientFone = Utils.format("XXXXX-XXXX", items[0].clientFone);
                $scope.request.clientMail = items[0].clientMail;
            
                $scope.request.requestItems = items;

                $scope.request.requestItems.map(function (el, indice, arr) {
                    arr[indice].totalItems = el.minQuantity * el.minGrade;
                    arr[indice].totalValue = Utils.toMoney(el.unitValue * arr[indice].totalItems, "R$");

                    $scope.request.totalRequest += parseFloat(el.unitValue) * arr[indice].totalItems;
                    $scope.request.totalItemsRequest += el.minQuantity * el.minGrade;

                    arr[indice].unitValue = Utils.toMoney(el.unitValue, "R$");
                });

                $scope.request.totalRequest = Utils.toMoney($scope.request.totalRequest.toFixed(2), "R$");

            } catch (e) {
                $log.error(e.message);
            }
        }
    });

    $scope.request = {};

}]);
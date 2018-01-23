var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var Client = (new (require('./clientModel'))).definition;
var FormPayment = (new (require('./formPaymentModel'))).definition;
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de clientes
var requestDefinition = Sequelize.define('Pedidos', {
    cdg_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    cdg_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Client,
            key: 'cdg_cliente',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    cdg_forma: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: FormPayment,
            key: 'cdg_forma',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    dta_pedido: { type: DataTypes.DATE },
    sts_pedido: { type: DataTypes.TEXT(1), allowNull: false }
});

//Objeto Usuário representa o registro
function RequestDefinition() {
    this.definition = requestDefinition;
}

RequestDefinition.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: {
                cdg_cliente: parans.clientCode,
                cdg_pedido: parans.code
            }
        });
    },

    getRequest: function (parans) {
        parans.orderByDirection = parans.orderByDirection ? parans.orderByDirection : "desc";
        parans.orderByField = parans.orderByField ? parans.orderByField : "code";
        var queryBuilder = new QueryBuilder(getSelectRequest(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("ped", "cdg_pedido", filters.code, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("ped", "cdg_cliente", filters.clientCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("cli", "nom_cliente", filters.clientName);
                queryBuilder.addFilter("pag", "cdg_forma", filters.paymentFormCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("ped", "dta_pedido", filters.requestDate, queryBuilder.COLUMN_TYPE.DATE);
                queryBuilder.addFilter("ped", "sts_pedido", filters.status);
            }
        }

        if (parans.agentCode)
            queryBuilder.addFilter("cli", "cdg_representante", parans.agentCode);

        if (parans.clientCode)
            queryBuilder.addFilter("cli", "cdg_cliente", parans.clientCode);

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    }
};

module.exports = RequestDefinition;

var getSelectRequest = function () {
    return "select ped.cdg_pedido \"code\""
        +   ", ped.cdg_cliente \"clientCode\""
        +   ", cli.nom_cliente \"clientName\""
        +   ", (select usu.nom_login"
        +   " from \"Usuarios\" usu"
        +   " where usu.cdg_usuario = cli.cdg_representante) \"agentName\""
        +   ", ped.cdg_forma \"paymentFormCode\""
        +   ", pag.dsc_forma \"paymentFormDesc\""
        +   ", to_char(ped.dta_pedido, 'DD/MM/YYYY') \"requestDate\""
        +   ", ped.sts_pedido \"status\""
        +   ", (select cg.dsc_significado"
        +   " from cg_ref_codes cg"
        +   " where cg.dsc_dominio = 'STATUS_PEDIDO'"
        +   " and cg.sgl_dominio = ped.sts_pedido) \"statusDesc\""
        +   " from \"Pedidos\" ped"
        +   " inner join \"Clientes\" cli"
        +   " on cli.cdg_cliente = ped.cdg_cliente"
        +   " inner join \"Formas_pagamentos\" pag"
        +   " on pag.cdg_forma = ped.cdg_forma";
};
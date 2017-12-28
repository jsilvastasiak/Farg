var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de clientes
var formPaymentDefinition = Sequelize.define('Formas_pagamento', {
    cdg_forma: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dsc_forma: {
        type: DataTypes.TEXT(50),
        allowNull: false
    },
    per_desconto: {
        type: DataTypes.DECIMAL(5,4),
        allowNull: true
    },
    idc_ativo: {
        type: DataTypes.STRING(1),
        allowNull: false
    }    
});

//Objeto Usuário representa o registro
function FormPayment() {
    this.definition = formPaymentDefinition;
}

FormPayment.prototype = {

    getDefinition: function () {
        return formPaymentDefinition.sync();
    },

    getByCode: function (parans) {
        return formPaymentDefinition.findOne({
            where: { cdg_forma: parans.code }
        });
    },

    getFormPayments: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectFormPayments(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("pag", "cdg_forma", filters.code, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("pag", "dsc_forma", filters.descForm);
                queryBuilder.addFilter("pag", "per_desconto", filters.discountValue, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("pag", "idc_ativo", filters.idcActive);
            }
        }

        if (parans.idcActive)
            queryBuilder.addFilter("pag", "idc_ativo", parans.idcActive);

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    }
};

module.exports = FormPayment;

var getSelectFormPayments = function () {
    return "select pag.cdg_forma \"code\""
        +  "     , pag.dsc_forma \"descForm\""
        +  "     , pag.per_desconto \"discountValue\""
        +  "     , pag.idc_ativo \"idcActive\""
        +  " from \"Formas_pagamentos\" pag";
}
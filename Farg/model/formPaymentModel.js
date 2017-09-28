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
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: { cdg_forma: parans.code }
        });
    }
};

module.exports = FormPayment;
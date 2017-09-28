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
        autoIncrement: true
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
                cdg_pedido: parans.reqCode
            }
        });
    }
};

module.exports = RequestDefinition;
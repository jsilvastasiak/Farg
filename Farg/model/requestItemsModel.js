var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var Grade = (new (require('./gradeModel'))).definition;
var Product = (new (require('./productModel'))).definition;
var Request = (new (require('./requestModel'))).definition;
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de clientes
var itemRequestDefinition = Sequelize.define('Items_pedido', {
    cdg_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    cdg_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    cdg_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    cdg_produto: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        allowNull: false,
        references: {
            model: Product,
            key: 'cdg_produto',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    vlr_atribuido: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    qtd_grade: { type: DataTypes.INTEGER, allowNull: false },
    cdg_grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Grade,
            key: 'cdg_grade',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    }
});

//Objeto Usuário representa o registro
function ItemRequestDefinition() {
    this.definition = itemRequestDefinition;
}

ItemRequestDefinition.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: {
                cdg_item: parans.itemCode,
                cdg_pedido: parans.requestCode
            }
        });
    }
};

module.exports = ItemRequestDefinition;
var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var Category = (new (require('./categoryModel'))).definition;
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de clientes
var productDefinition = Sequelize.define('Produtos', {
    cdg_produto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cdg_categoria: {
        type: DataTypes.INTEGER,        
        references: {
            model: Category,
            key: 'cdg_categoria',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    nom_produto: {
        type: DataTypes.TEXT(50), allowNull: false
    },
    idc_ativo: {
        type: DataTypes.TEXT(1), allowNull: false
    }
});

//Objeto Usuário representa o registro
function Product() {
    this.definition = productDefinition;
}

Product.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: {
                cdg_produto: parans.code                
            }
        });
    }
};

module.exports = Product;
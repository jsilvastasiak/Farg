var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de clientes
var categoryDefinition = Sequelize.define('Categorias', {
    cdg_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_categoria: {
        type: DataTypes.TEXT(20),
        allowNull: false
    },    
    idc_ativo: {
        type: DataTypes.STRING(1),
        allowNull: false
    }
});

//Objeto Usuário representa o registro
function Category() {
    this.definition = categoryDefinition;
}

Category.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: { cdg_categoria: parans.code }
        });
    }
};

module.exports = Category;
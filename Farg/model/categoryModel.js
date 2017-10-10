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
    },

    getCategorys: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectCategorys(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("cat", "cdg_categoria", filters.code, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("cat", "nom_categoria", filters.categoryName);
                queryBuilder.addFilter("cat", "idc_ativo", filters.idcActive);
            }
        } else {
            if (parans.idcActive)
                queryBuilder.addFilter("cat", "idc_ativo", parans.idcActive);
        }

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    }
};

module.exports = Category;

var getSelectCategorys = function () {
    return "select cat.cdg_categoria \"code\""
        + "     , cat.nom_categoria \"categoryName\""
        + "     , cat.idc_ativo \"idcActive\""        
        + " from \"Categorias\" cat";
}
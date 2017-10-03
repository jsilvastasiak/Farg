﻿var util = require('util');
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
    },

    getProducts: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectProducts(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("prod", "cdg_produto", filters.code, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("prod", "cdg_categoria", filters.categoryCode);
                queryBuilder.addFilter("prod", "nom_produto", filters.productName);
                queryBuilder.addFilter("prod", "idc_ativo", filters.idcActive);
            }
        }

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    }
};

module.exports = Product;

var getSelectProducts = function () {
    return "select prod.cdg_produto \"code\""
        + "     , prod.cdg_categoria \"categoryCode\""
        + "     , cat.nom_categoria  \"categoryName\""
        + "     , prod.nom_produto \"productName\""
        + "     , prod.idc_ativo \"idcActive\""
        + " from \"Produtos\" prod"
        + " inner join \"Categorias\" cat"
        + " on prod.cdg_categoria = cat.cdg_categoria";
}
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
    vlr_icms_8: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    vlr_icms_12: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    vlr_icms_17: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
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
                queryBuilder.addFilter("prod", "cdg_categoria", filters.categoryCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("prod", "nom_produto", filters.productName);
                queryBuilder.addFilter("prod", "vlr_icms_8", filters.prodValIcm8, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("prod", "vlr_icms_12", filters.prodValIcm12, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("prod", "vlr_icms_17", filters.prodValIcm17, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("prod", "idc_ativo", filters.idcActive);
            }
        }

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    },

    getClientProducts: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectClientProducts(), true, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("prod", "cdg_categoria", filters.categoryCode, queryBuilder.COLUMN_TYPE.NUMBER);
            }
        }

        if (parans.code) {
            queryBuilder.addFilter("prod", "cdg_produto", parans.code, queryBuilder.COLUMN_TYPE.NUMBER);
        }

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize, {
            "tip_icms": parans.client.icmsCode,
            "cdg_usuario": parans.client.code
        });
    },

    getParansProduct: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectParansToProduct(), false, parans);
        
        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize, {
            "tip_icms": parans.icmsCode,
            "cdg_cliente": parans.clientCode ? parans.clientCode : 0,
            "cdg_produto": parans.code,
            "cdg_grade": parans.gradeCode,
            "cdg_forma": parans.paymentFormCode
        });
    },

    getCarProducts: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectCarProducts(parans.codesList), false, parans);

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
        + "     , prod.vlr_icms_8  \"prodValIcm8\""
        + "     , prod.vlr_icms_12  \"prodValIcm12\""
        + "     , prod.vlr_icms_17  \"prodValIcm17\""
        + "     , prod.idc_ativo \"idcActive\""
        + " from \"Produtos\" prod"
        + " inner join \"Categorias\" cat"
        + " on prod.cdg_categoria = cat.cdg_categoria";
}

var getSelectClientProducts = function () {
    return "select prod.cdg_produto \"productCode\""
        +  ", prod.nom_produto \"productName\""
        +  ", case"
        + " when :tip_icms IN (7,8) then prod.vlr_icms_8"
        + " when :tip_icms = 12 then prod.vlr_icms_12"
        + " when :tip_icms IN (17,18) then prod.vlr_icms_17"
        + " else prod.vlr_icms_17"
        + " end \"productValue\""
        + ", (select cli.per_desconto "
        + " from \"Clientes\" cli"            
        + " where cli.cdg_usuario = :cdg_usuario) \"discountValueCli\""
        + ", ima.dsc_caminho \"filename\""
        + ", (select cat.nom_categoria"
        + " from \"Categorias\" cat"
        + " where cat.cdg_categoria = prod.cdg_categoria) \"categoryName\""
        + " from \"Produtos\" prod"
        + " left outer join \"Imagens_produtos\" ima"
        + " on ima.cdg_produto = prod.cdg_produto"
        + " and ima.cdg_imagem = 1"
        + " where prod.idc_ativo = 'A'";
}

var getSelectParansToProduct = function () {
    return "select (select case"
        + " when :tip_icms IN (7,8) then prod.vlr_icms_8"
        + " when :tip_icms = 12 then prod.vlr_icms_12"
        + " when :tip_icms IN (17,18) then prod.vlr_icms_17"
        + " else prod.vlr_icms_17"
        + " end  from \"Produtos\" prod where cdg_produto = :cdg_produto) \"productValue\""
        + ", (select gra.per_desconto from \"Grades\" gra where gra.cdg_grade = :cdg_grade) \"discountGrade\""
        + ", (select frm.per_desconto from \"Formas_pagamentos\" frm where frm.cdg_forma = :cdg_forma) \"discountPaymentForm\""
        + ", (select cli.per_desconto from \"Clientes\" cli where cli.cdg_cliente = :cdg_cliente) \"discountClient\"";

};

var getSelectCarProducts = function (codesList) {
    return "select prod.cdg_produto \"code\""
        + ", prod.nom_produto \"productName\""
        + ", (select ima.dsc_caminho"
        + " from \"Imagens_produtos\" ima"
        + " where ima.cdg_produto = prod.cdg_produto"
        + " and ima.cdg_imagem = 1) \"filename\""
        + " from \"Produtos\" prod"
        + " where prod.cdg_produto in (" + codesList + ")";
};
var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var Product = (new (require('./productModel'))).definition;
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de clientes
var productImage = Sequelize.define('Imagens_produto', {
    cdg_produto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Product,
            key: 'cdg_produto',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    cdg_imagem: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    dad_imagem: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    idc_ativo: {
        type: DataTypes.TEXT(1), allowNull: true
    }
});

//Objeto Usuário representa o registro
function ProductImage() {
    this.definition = productImage;
}

ProductImage.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: {
                cdg_produto: parans.productCode,
                cdg_imagem: parans.imageCode
            }
        });
    },

    getImageProducts: function (parans) {
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

module.exports = ProductImage;
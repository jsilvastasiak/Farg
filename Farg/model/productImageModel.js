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
    dsc_imagem: {
        type: DataTypes.TEXT(100),
        allowNull: false
    },    
    dsc_caminho: {
        type: DataTypes.TEXT(100),
        allowNull: false
    },
    idc_ativo: {
        type: DataTypes.TEXT(1),
        allowNull: false
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
        var queryBuilder = new QueryBuilder(getSelectImages(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("ima", "cdg_produto", filters.productCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("ima", "cdg_imagem", filters.imageCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("ima", "dsc_imagem", filters.imageDescription);
                queryBuilder.addFilter("ima", "idc_ativo", filters.idcActive);
            }
        }

        if (parans.code)
            queryBuilder.addFilter("ima", "cdg_produto", parans.code, queryBuilder.COLUMN_TYPE.NUMBER);

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    }
};

module.exports = ProductImage;

var getSelectImages = function () {
    return "select ima.cdg_produto \"productCode\""
        + ", ima.cdg_imagem \"imageCode\""
        + ", ima.dsc_imagem \"imageDescription\""
        + ", ima.idc_ativo \"idcActive\""
        + ", ima.dsc_caminho \"filename\""
        + " from \"Imagens_produtos\" ima";
};
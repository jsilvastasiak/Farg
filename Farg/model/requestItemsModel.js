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
    },

    getRequestItems: function (parans) {
        var queryBuilder = new QueryBuilder(getSelecetRequestItem(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("ite", "cdg_pedido", filters.requestCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("ite", "cdg_cliente", filters.clientCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("ite", "cdg_item", filters.code, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("ite", "cdg_produto", filters.productCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("pro", "nom_produto", filters.productName);
                queryBuilder.addFilter("ite", "cdg_grade", filters.gradeCode, queryBuilder.COLUMN_TYPE.NUMBER);
            }
        }

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    }
};

module.exports = ItemRequestDefinition;

var getSelecetRequestItem = function () {
    return "select ite.cdg_item \"itemCode\""
       +   ", ite.cdg_produto \"productCode\""
       +   ", pro.nom_produto \"productName\""
       +   ", ite.vlr_atribuido \"productValue\""
       +   ", ite.qtd_grade   \"quantity\""
       +   ", ite.cdg_grade	 \"gradeCode\""
       +   ", gra.dsc_grade	\"gradeDesc\""
       +   ", gra.qtd_minima * ite.qtd_grade * ite.vlr_atribuido \"totalValue\""
       +   " from \"Items_pedidos\" ite"
       +   " inner join \"Produtos\" pro"
       +   " on pro.cdg_produto = ite.cdg_produto"
       +   " inner join \"Grades\" gra"
       +   " on gra.cdg_grade = ite.cdg_grade";
}
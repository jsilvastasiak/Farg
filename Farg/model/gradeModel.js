var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de clientes
var gradeDefinition = Sequelize.define('Grades', {
    cdg_grade: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dsc_grade: {
        type: DataTypes.TEXT(20), allowNull: false
    },
    per_desconto: {
        type: DataTypes.DECIMAL(5,4), allowNull: true
    },
    qtd_minima: {
        type: DataTypes.INTEGER, allowNull: false
    },
    idc_ativo: {
        type: DataTypes.TEXT(1), allowNull: false
    }
});

//Objeto Usuário representa o registro
function Grade() {
    this.definition = gradeDefinition;
}

Grade.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: {
                cdg_grade: parans.gradeCode
            }
        });
    },

    getGrades: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectGrades(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("gra", "cdg_grade", filters.gradeCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("gra", "dsc_grade", filters.descGrade);
                queryBuilder.addFilter("gra", "per_desconto", filters.discountValue, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("gra", "qtd_minima", filters.minQuantity, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("gra", "idc_ativo", filters.idcActive);
            }
        }

        if (parans.idcActive)
            queryBuilder.addFilter("gra", "idc_ativo", parans.idcActive);

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    }
};

module.exports = Grade;

var getSelectGrades = function () {
    return "select gra.cdg_grade \"gradeCode\""
         + "     , gra.dsc_grade \"descGrade\""
         + "     , gra.per_desconto \"discountValue\""
         + "     , gra.qtd_minima \"minQuantity\""
         + "     , gra.idc_ativo \"idcActive\""
         + " from \"Grades\" gra";
}
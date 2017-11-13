var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var Product = (new (require('./productModel'))).definition;
var Grade = (new (require('./gradeModel'))).definition;
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de clientes
var productGradeDefinition = Sequelize.define('Grade_produtos', {
    cdg_grade: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Grade,
            key: 'cdg_grade',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    cdg_produto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Product,
            key: 'cdg_produto',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    idc_habilitado: {
        type: DataTypes.TEXT(1),
        allowNull: false,
        get() {
            return this.getDataValue('idc_habilitado') === 'S' ? true : false;
        },
        set(value) {
            this.setDataValue('idc_habilitado', value ? 'S' : 'N');
        }
    }
});

//Objeto Usuário representa o registro
function ProductGrade() {
    this.definition = productGradeDefinition;
}

ProductGrade.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: {
                cdg_produto: parans.productCode,
                cdg_grade: parans.gradeCode
            }
        });
    },

    getGrades: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectGrades(), false, parans);
        var filtersObj = {};

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                //ÅqueryBuilder.addFilter("gra", "cdg_grade", filters.gradeCode, queryBuilder.COLUMN_TYPE.NUMBER);
                if (filters.idcEnable !== undefined)
                    queryBuilder.addFilter("gra", "idc_habilitado", filters.idcEnable ? 'S' : 'N');
                filtersObj = filters;
            }
        }

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize, {
                "gradeCode": filtersObj.gradeCode
            }
        );
    }
};

module.exports = ProductGrade;

var getSelectGrades = function () {
    return "select coalesce((select gra.idc_habilitado"
        +  " from \"Grade_produtos\" gra"
        +  " where gra.cdg_produto = pro.cdg_produto"
        +  " and gra.cdg_grade = :gradeCode)," 
        +  " (select gra.idc_habilitado"
        +  " from \"Grade_produtos\" gra"
        +  " where gra.cdg_produto = pro.cdg_produto"
        +  " and gra.cdg_grade = :gradeCode), 'N') \"idcEnable\""
        + ", pro.cdg_produto \"productCode\""
        + ", pro.nom_produto \"productName\""        
        + " from \"Produtos\" pro"
        + " left outer join \"Grade_produtos\" gra"
        + " on gra.cdg_produto = pro.cdg_produto";
}
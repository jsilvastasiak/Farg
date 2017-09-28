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
                cdg_grade: parans.code
            }
        });
    }
};

module.exports = Grade;
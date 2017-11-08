var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de clientes
var parametersDefinition = Sequelize.define('Parametros_gerais', {
    cdg_empresa: {
        type: DataTypes.INTEGER,
        primaryKey: true        
    },
    cdg_filial: {
        type: DataTypes.INTEGER,
        primaryKey: true        
    },
    nom_fantasia: {
        type: DataTypes.TEXT(50), allowNull: true
    },
    nom_host_email: {
        type: DataTypes.TEXT(100), allowNull: true
    },
    nro_port_email: {
        type: DataTypes.INTEGER, allowNull: true
    },
    nom_usuario_email: {
        type: DataTypes.TEXT(50), allowNull: true
    },
    snh_usuario_email: {
        type: DataTypes.TEXT(100), allowNull: true
    },
    email_remetente: {
        type: DataTypes.TEXT(50), allowNull: true
    }
});

//Objeto Usuário representa o registro
function Parameters() {
    this.definition = parametersDefinition;
}

Parameters.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: {
                cdg_empresa: parans.companyCode,
                cdg_filial: parans.subsidiaryCode
            }
        });
    }    
};

module.exports = Parameters;
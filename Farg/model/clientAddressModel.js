var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var Client = (new (require('./clientModel'))).definition;
var QueryBuilder = require('../model/common/queryBuilder');
//var thisUser = new User();

//Definição da tabela de clientes
var clientAddressDefinition = Sequelize.define('Enderecos', {
    cdg_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Client,
            key: 'cdg_cliente',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }        
    },
    tip_endereco: {
        type: DataTypes.STRING(1),
        allowNull: false,
        primaryKey: true
    },
    sgl_estado: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    nom_cidade: { type: DataTypes.TEXT(20), allowNull: false },
    nom_rua: { type: DataTypes.TEXT(100), allowNull: false },
    nom_bairro: { type: DataTypes.TEXT(20), allowNull: false },
    nro_end: { type: DataTypes.INTEGER, allowNull: false },
    nro_cep: { type: DataTypes.TEXT(10) },
    cpl_end: { type: DataTypes.TEXT(30) },
    nro_fon_pri: {type: DataTypes.TEXT(20) },
    ddd_fon_pri: {type: DataTypes.TEXT(5) },
    nro_fon_sec: {type: DataTypes.TEXT(20) },
    ddd_fon_sec: {type: DataTypes.TEXT(5) },
    nro_celular: {type: DataTypes.TEXT(20) },
    ddd_celular: {type: DataTypes.TEXT(5) }
});

//Objeto Usuário representa o registro
function ClientAddress() {
    this.definition = clientAddressDefinition;
}

ClientAddress.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (parans) {
        return this.definition.findOne({
            where: {
                cdg_cliente: parans.clientCode,
                tip_endereco: parans.addressType
            }
        });
    },

    getAddressClientList: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectAddressClients(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("adr", "cdg_cliente", filters.clientCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("adr", "tip_endereco", filters.addressType);
                queryBuilder.addFilter("adr", "nro_cep", filters.cepNumber);
                queryBuilder.addFilter("adr", "sgl_estado", filters.uf);
                queryBuilder.addFilter("adr", "nom_cidade", filters.cityName);
                queryBuilder.addFilter("adr", "nom_bairro", filters.districtName);
                queryBuilder.addFilter("adr", "nom_rua", filters.streetName);
                queryBuilder.addFilter("adr", "nro_end", filters.streetNumber, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("adr", "cpl_end", filters.compAddress);
                queryBuilder.addFilter("adr", "ddd_fon_pri", filters.priDDDNumber, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("adr", "nro_fon_pri", filters.priFoneNumber, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("adr", "ddd_fon_sec", filters.secDDDNumber, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("adr", "nro_fon_sec", filters.secFoneNumber, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("adr", "ddd_celular", filters.celDDDNumber, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("adr", "nro_celular", filters.celFoneNumber, queryBuilder.COLUMN_TYPE.NUMBER);
            }
        }

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    }    
}

module.exports = ClientAddress;

var getSelectAddressClients = function () {
    return "select adr.cdg_cliente  \"clientCode\""
                +  ", adr.tip_endereco \"addressType\""
                +  ", adr.nro_cep \"cepNumber\""
                +  ", adr.sgl_estado \"uf\""
                +  ", adr.nom_cidade \"cityName\""
                +  ", adr.nom_bairro \"districtName\""
                +  ", adr.nom_rua \"streetName\""
                +  ", adr.nro_end \"streetNumber\""
                +  ", adr.cpl_end \"compAddress\""
                +  ", adr.ddd_fon_pri \"priDDDNumber\""
                +  ", adr.nro_fon_pri \"priFoneNumber\""
                +  ", adr.ddd_fon_sec \"secDDDNumber\""
                +  ", adr.nro_fon_sec \"secFoneNumber\""
                +  ", adr.ddd_celular \"celDDDNumber\""
                +  ", adr.nro_celular \"celFoneNumber\""
           + " from \"Enderecos\" adr";
};
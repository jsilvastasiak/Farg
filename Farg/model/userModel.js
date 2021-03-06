﻿var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var QueryBuilder = require('../model/common/queryBuilder');

//Definição da tabela de usuario
var userDefinition = Sequelize.define('Usuarios', {
    cdg_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_login: {
        type: DataTypes.TEXT(20),
        unique: true
    },
    snh_usuario: { type: DataTypes.TEXT(50) },
    idc_administrador: { type: DataTypes.TEXT(1) },
    idc_representante: { type: DataTypes.TEXT(1) },
    idc_cliente: { type: DataTypes.TEXT(1) },
    idc_ativo: { type: DataTypes.TEXT(1) }
});

//Objeto Usuário representa o registro
function User() {
    this.definition = userDefinition;    
}

User.prototype = {
    
    getDefinition: function () {
        return this.definition.sync();
    },
    
    getByCode: function (code) {           
        return this.definition.findOne({
            where: { cdg_usuario: code }
        });
    },
    //Seleciona usuário pelo login do mesmo
    getByLogin: function (loginText) {
        //Objeto de retorno
        return Sequelize.query(getSelectUserByLogin(),
            {
                replacements: {
                    login: loginText
                },
                type: Sequelize.QueryTypes.SELECT
            });
    },

    getUsers: function (parans) {        
        var queryBuilder = new QueryBuilder(getSelectUsers(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("c", "cdg_usuario", filters.code, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("c", "nom_login", filters.login);
                queryBuilder.addFilter("c", "idc_administrador", filters.isAdmin);
                queryBuilder.addFilter("c", "idc_representante", filters.isAgent);
                queryBuilder.addFilter("c", "idc_cliente", filters.isClient);
                queryBuilder.addFilter("c", "idc_ativo", filters.statusUser);
            }
        }
        
        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    }
}

module.exports = User;

var getSelectUserByLogin = function () {
    return "select c.cdg_usuario \"codigo\""
        + ", c.snh_usuario \"senha\""
        + ", c.idc_administrador \"isAdmin\""
        + ", c.idc_representante \"isAgente\""
        + ", c.idc_cliente \"isClient\""
        + ", cli.cdg_cliente \"clientCode\""  
        + ", cli.nom_cliente \"clientName\""
        + ", cli.end_email \"clientEmail\""
        + ", coalesce((select(select icms.cdg_icms"
        + "              from \"Codigo_icms\" icms"
        + "             where icms.uf_destino = ende.sgl_estado)"
        + "     from \"Enderecos\" ende"
        + "    where ende.cdg_cliente = cli.cdg_cliente"
        + "      and ende.tip_endereco = 'E')"
        + ", (select icms.cdg_icms"
        + " from \"Codigo_icms\" icms"
        + " where icms.uf_destino = (select constante(1)))) \"icmsCode\""
        + " from \"Usuarios\" c"
        + " left outer join \"Clientes\" cli"
        + " on cli.cdg_usuario = c.cdg_usuario"
        + " where upper(c.nom_login) like upper(:login)";
};

var getSelectUsers = function () {
    return "select c.cdg_usuario \"code\""
        + ", c.nom_login \"login\""
        + ", c.idc_administrador \"isAdmin\""
        + ", c.idc_representante \"isAgent\""
        + ", c.idc_cliente \"isClient\""
        + ", c.idc_ativo \"isActive\""
        + " from \"Usuarios\" c";
}
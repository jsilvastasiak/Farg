var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var User = (new (require('./userModel'))).definition;
var QueryBuilder = require('../model/common/queryBuilder');
//var thisUser = new User();

//Definição da tabela de clientes
var clientDefinition = Sequelize.define('Clientes', {
    cdg_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_cliente: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    tip_pessoa: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    per_desconto: { type: DataTypes.DECIMAL(5, 2) },
    nro_cnpj: { type: DataTypes.STRING(14) },
    nro_cpf: { type: DataTypes.STRING(11) },
    dta_cadastro: {
        type: DataTypes.DATEONLY
    },
    end_email: { type: DataTypes.STRING(50) },    
    cdg_representante: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'cdg_usuario',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    cdg_usuario: {
        type: DataTypes.INTEGER,  
        allowNull: false,
        references: {
            model: User,
            key: 'cdg_usuario',
            deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
        }
    }
});

//Objeto Usuário representa o registro
function Client() {
    this.definition = clientDefinition;
}

Client.prototype = {

    getDefinition: function () {
        return this.definition.sync();
    },

    getByCode: function (code) {
        return this.definition.findOne({
            where: { cdg_cliente: code }
        });
    },

    getMail: function (code) {
        return this.definition.findOne({
            attributes: [['nom_cliente', 'clientName'], ['end_email', 'clientMail']],
            where: { cdg_cliente: code }
        });
    },

    getClientList: function (parans) {
        var queryBuilder = new QueryBuilder(getSelectClients(), false, parans);

        if (parans.filters) {
            var filters = JSON.parse(parans.filters);
            //Verifica se existem filtros com valores
            if (Object.keys(filters).length > 0) {
                queryBuilder.addFilter("cli", "cdg_cliente", filters.code, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("cli", "nom_cliente", filters.clientName);
                queryBuilder.addFilter("cli", "tip_pessoa", filters.personType);
                queryBuilder.addFilter("cli", "nro_cnpj", filters.cnpjNumber);
                queryBuilder.addFilter("cli", "nro_cpf", filters.cpfNumber);
                queryBuilder.addFilter("cli", "end_email", filters.email);
                queryBuilder.addFilter("cli", "per_desconto", filters.discountValue, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("cli", "dta_cadastro", filters.registerDate, queryBuilder.COLUMN_TYPE.DATE);
                queryBuilder.addFilter("cli", "cdg_usuario", filters.clientUserCode, queryBuilder.COLUMN_TYPE.NUMBER);
                queryBuilder.addFilter("us", "nom_login", filters.agentName);
            }
        }

        //Objeto de retorno
        return queryBuilder.executeBuilder(Sequelize);
    },

    insertClient: function (parans) {

        return Sequelize.query(getInsertClient(), {
                replacements: {
                    nom_cliente: parans.clientName,
                    tip_pessoa: parans.personType,
                    nro_cnpj: parans.cnpjNumber,
                    nro_cpf: parans.cpfNumber,
                    per_desconto: parans.discountValue,
                    end_email: parans.email.toUpperCase(), //E-mail servirá como login
                    cdg_usu_cad: parans.agentCode
                }
            }
        );
    }
    //},

    //testeData: function () {
    //    //return Sequelize.query("select now() \"date\" from \"Clientes\" c where date_trunc('day', c.dta_cadastro) = to_date('28/09/2017', 'DD/MM/yyyy')", { type: Sequelize.QueryTypes.SELECT });
    //    return Sequelize.query("select pegadata(now())", { type: Sequelize.QueryTypes.SELECT });
    //}
}

module.exports = Client;

var getSelectClients = function () {
    return "select cli.cdg_cliente  \"code\""
        + ", cli.nom_cliente  \"clientName\""
        + ", cli.tip_pessoa   \"personType\""
        + ", cli.nro_cnpj     \"cnpjNumber\""
        + ", cli.nro_cpf      \"cpfNumber\""
        + ", cli.end_email    \"email\""
        + ", cli.per_desconto \"discountValue\""
        + ", pegadata(cli.dta_cadastro) \"registerDate\""
        + ", cli.cdg_usuario  \"clientUserCode\""
        + ", us.nom_login     \"agentName\""
        + " from \"Clientes\" cli"
        + " left outer join \"Usuarios\" us"
        + " on(us.cdg_usuario = cli.cdg_representante)";
};

var getInsertClient = function () {
    return "SELECT inserecliente (:nom_cliente"
        + " ,:tip_pessoa"
        + " ,:nro_cnpj"
        + " ,:nro_cpf"
        + " ,:per_desconto"
        + " ,:end_email"
        + " ,:cdg_usu_cad)";
}
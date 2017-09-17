var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');
var User = (new (require('./userModel'))).definition;
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
    dta_cadastro: { type: DataTypes.DATE },
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
    }    
}

module.exports = Client;
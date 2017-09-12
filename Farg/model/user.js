var util = require('util');
var Sequelize = require('./connectionFactory');
var DataTypes = require('sequelize');

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
}

module.exports = User;

var getSelectUserByLogin = function () {
    return "select c.codigo"
        + ", c.senha"
        +", case when c.tipo = 1 then 'S' else 'N' end \"isAdmin\""
        +", case when c.tipo = 2 then 'S' else 'N' end \"isAgent\""
        +", case when c.tipo = 3 then 'S' else 'N' end \"isClient\""
        +" from usuarios c"
        +" where upper(c.login) like upper(:login)";
}
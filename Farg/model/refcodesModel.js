var util = require('util');
var Sequelize = require('./connectionFactory');

//Objeto Usuário representa o registro
function RefCodes() {
    this.definition = undefined;
}

RefCodes.prototype = {

    getDefinition: function () {
        return undefined;
    },

    getValuesByDomain: function (domainDesc) {
        return Sequelize.query(getSelectRefCodes(),
            {
                replacements: {
                    domainDesc: domainDesc
                },
                type: Sequelize.QueryTypes.SELECT
            });
    }   
}

module.exports = RefCodes;

var getSelectRefCodes = function(){
    return "select c.dsc_dominio \"domain\""
        + ", c.sgl_dominio \"domainValue\""
        + ", c.dsc_significado \"domainMeaning\""
        + " from cg_ref_codes c"
        + " where upper (c.dsc_dominio) like upper(:domainDesc)";
};
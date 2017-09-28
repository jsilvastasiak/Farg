var Moment = require('moment-timezone');

function QueryBuilder(queryBase, hasWhereClause, parans) {
    this._mainQuery = queryBase;
    this._hasWhereClause = hasWhereClause;
    this._queryParans = parans;
    //Filtros para query
    this._filters = [];

    this.COLUMN_TYPE = {
        TEXT: 1,
        NUMBER: 2,
        DATE: 3,
        BOOLEAN: 4,
        DATE: 5
    };
}

QueryBuilder.prototype = {   

    createQuery: function () {
        var queryBase = "select COUNT(*) over () as __totalGeral"
            + ", d.*"
            + " from({0}{1}) d";    

        var offset = "";
        var limit = "";
        var orderByClause = "";
        var filters = "";

        if (this._queryParans) {
            /*Controle de Paginação*/
            if (this._queryParans.startRowIndex)
                offset = " offset " + this._queryParans.startRowIndex;

            if (this._queryParans.maximumRows)
                limit = " limit " + this._queryParans.maximumRows;

            /*Controle de ordenação*/
            if (this._queryParans.orderByField)
                orderByClause = " order by d.\"" + this._queryParans.orderByField + "\" " + this._queryParans.orderByDirection;
            
        }

        queryBase = queryBase.replace('{0}', this._mainQuery);
        queryBase = queryBase.replace('{1}', this.mergeFilters());
        queryBase += orderByClause + offset + limit;

        return queryBase;
    },
    
    executeBuilder: function (sequelize) {
        replacements = {};

        if (this._filters.length > 0) {

            this._filters.forEach(function (filter) {
                //Cria propiedade dinâmica de replacements da query
                Object.defineProperty(replacements, filter.alias + filter.colName, {
                    value: filter.value
                });
            });
        }       

        return sequelize.query(this.createQuery(),
            {
                replacements: replacements,
                type: sequelize.QueryTypes.SELECT
            });
    },
    /*Adiciona filtro para query*/
    addFilter: function (alias, colName, value, type) {

        if (value) {
            var colType = type ? type : this._getTypeValue(value);
            var clause = null;

            var objectFilter = {
                value: value,
                alias: alias,
                colName: colName
            };

            //Tratamento para data
            if (colType === this.COLUMN_TYPE.DATE) {
                clause = "DATE_TRUNC('day', " + alias + "." + colName + ") = TO_DATE(:" + alias + colName + ", 'DD/MM/yyyy')";
            }
            else if (colType === this.COLUMN_TYPE.TEXT) {
                clause = "UPPER(" + alias + "." + colName + ") like (UPPER(:" + alias + colName + "))";            
            }
            else if (colType === this.COLUMN_TYPE.NUMBER) {
                clause = alias + "." + colName + " = :" + alias + colName;
            } else if (colType === this.COLUMN_TYPE.BOOLEAN) {
                clause = alias + "." + colName + " = :" + alias + colName;
                objectFilter.value = value ? 'S' : 'N';
            }

            objectFilter.clause = clause;
            this._filters.push(objectFilter);
        }
    },

    mergeFilters: function () {
        var finalClause = "";
        var initWhereClause = !this._hasWhereClause ? " WHERE " : " AND ";
        //Filtra somente filtros com valor, se não tem valor não faz sentido filtrar na query
        var filtersToQuery = this._filters.filter(function (item) {
            if (item.value)
                return true;
            return false;
        });

        for (var i = 0; i < filtersToQuery.length; i++) {            
            if (i > 0)
                finalClause += " AND ";
            else
                finalClause += initWhereClause;

            finalClause += filtersToQuery[i].clause;            
        }

        return finalClause;
    },

    _getTypeValue: function (value) {
        var type;
                
        if (typeof value === "number")
            type = this.COLUMN_TYPE.NUMBER;
        else if (typeof value === "boolean")
            type = this.COLUMN_TYPE.BOOLEAN;
        else
            type = this.COLUMN_TYPE.TEXT;

        return type;
    }
};

module.exports = QueryBuilder;
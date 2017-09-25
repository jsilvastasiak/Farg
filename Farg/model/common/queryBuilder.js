function QueryBuilder(queryBase, hasWhereClause, parans) {
    this._mainQuery = queryBase;
    this._hasWhereClause = hasWhereClause;
    this._queryParans = parans;
}

QueryBuilder.prototype = {
    _createFiltersString: function (filtersObject) {
        

    },

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

            /*filtros opcionais*/
            if (this._queryParans.filters) {
                filters = 
            }
        }

        queryBase = queryBase.replace('{0}', this._mainQuery);
        queryBase += orderByClause + offset + limit;        

        return queryBase;
    }
};

module.exports = QueryBuilder;
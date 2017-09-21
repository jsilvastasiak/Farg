function QueryBuilder(queryBase, parans) {
    this._mainQuery = queryBase;
    this._queryParans = parans;
}

QueryBuilder.prototype = {

    createQuery: function () {
        var queryBase = "select COUNT(*) over () as __totalGeral"
            + ", d.*"
            + " from({0}) d";       

        var offset = "";
        var limit = "";
        
        queryBase = queryBase.replace('{0}', this._mainQuery);

        if (this._queryParans) {
            /*Controle de Paginação*/
            if (this._queryParans.startRowIndex)
                offset = " offset " + this._queryParans.startRowIndex;

            if (this._queryParans.maximumRows)
                limit = " limit " + this._queryParans.maximumRows;
        }
       
        queryBase += offset + limit;

        return queryBase;
    }
};

module.exports = QueryBuilder;
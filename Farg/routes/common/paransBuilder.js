'use strict';

function CreateParansModel(req) {
    var parans = {};

    /*Cálculo linha início query*/
    if (req.pagerInfo) {
        var pagerInfo = JSON.parse(req.pagerInfo);
        parans.startRowIndex = (pagerInfo.bigCurrentPage - 1) * pagerInfo.itemsPerPage
        parans.maximumRows = pagerInfo.itemsPerPage;
        parans.orderByField = req.orderByField;
        parans.orderByDirection = req.orderByDirection;
        parans.filters = req.filters;
    }

    return parans;
};

function createParansResponse(resultList, req) {
    var finalResult = {};

    if (resultList.length > 0) {
        finalResult.totalItems = resultList[0].__totalgeral;
    }

    //Deleta coluna totalizadora da query
    resultList.forEach(function (item) {
        delete item.__totalgeral;
    });

    finalResult.result = resultList;
    finalResult.datasourceId = req.query.datasourceId;
    
    return finalResult;
};

module.exports = {
    createParansModel: CreateParansModel,
    createParansResponse: createParansResponse
};
'use strict';

function CreateParansModel(req) {
    var parans = {};

    /*Cálculo linha início query*/
    if (req.pagerInfo) {
        var pagerInfo = JSON.parse(req.pagerInfo);
        parans.startRowIndex = (pagerInfo.bigCurrentPage - 1) * pagerInfo.itemsPerPage
        parans.maximumRows = pagerInfo.itemsPerPage;
    }

    return parans;
};

function createParansResponse(resultList) {
    var finalResult = {};

    if (resultList.length > 0) {
        finalResult.totalItems = resultList[0].__totalgeral;
    }

    //Deleta coluna totalizadora da query
    resultList.forEach(function (item) {
        delete item.__totalgeral;
    });

    finalResult.result = resultList;
    
    return finalResult;
};

module.exports = {
    createParansModel: CreateParansModel,
    createParansResponse: createParansResponse
};
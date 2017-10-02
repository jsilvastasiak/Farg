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

/**
 * Cria objeto com a mensagem que deverá ser enviada como resposta no caso de operação de delete de
   um registro
 */
function deleteMessageToResponse(instance, err) {
    var responseMessage = {};

    if(instance && instance != null)

        if (instance == 0) {
            responseMessage.message = "Não foi possível excluir o registro.";
            responseMessage.type = 'danger';
        } else {
            responseMessage.message = "Registro deletado com sucesso!";
            responseMessage.type = 'success';
        }
    else {
        if (err) {
            if (err.name == "SequelizeForeignKeyConstraintError")
                responseMessage.message = "Não é possível excluir o registro pois existem registros que dependem do mesmo.";
            else
                responseMessage.message = err.message;

            responseMessage.type = 'danger';
        }
    }

    return responseMessage;
};

/**
 * Cria objeto com a mensagem que deverá ser enviada como resposta no caso de operação de update de
   um registro
 */
function updateMessageToResponse(err) {
    var responseMessage = {};

    if (err) {
        responseMessage.message = "Não foi possível atualizar o registro. " + err.message;
        responseMessage.type = 'danger';
    }else {
        responseMessage.message = "Registro atualizado com sucesso!";
        responseMessage.type = 'success';
    }

    return responseMessage;
};

/**
 * Cria objeto com a mensagem que deverá ser enviada como resposta no caso de operação de insert de
   um registro
 */
function insertMessageToResponse(err) {
    var responseMessage = {};

    if (err) {
        responseMessage.message = "Não foi possível inserir o registro. " + err.message;
        responseMessage.type = 'danger';
    } else {
        responseMessage.message = "Registro inserido com sucesso!";
        responseMessage.type = 'success';
    }

    return responseMessage;
}

module.exports = {
    createParansModel: CreateParansModel,
    createParansResponse: createParansResponse,
    deleteMessageToResponse: deleteMessageToResponse,
    updateMessageToResponse: updateMessageToResponse,
    insertMessageToResponse: insertMessageToResponse
};
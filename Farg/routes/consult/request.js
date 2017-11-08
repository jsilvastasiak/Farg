'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Product = require('../../model/productModel');
var Request = require('../../model/requestModel');
var RequestItem = require('../../model/requestItemsModel');
var Client = require('../../model/clientModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');
var Mail = require('../../model/common/mail');
var Parameters = require('../../model/parametersModel');

var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('consult/request', { title: 'Pedidos' });
});

router.get('/request-items', auth.isAuthenticated, function (req, res) {
    res.render('consult/request-items');
});

router.get('/request-control', auth.isAuthenticated, function (req, res) {
    res.render('consult/request-control');
});

/* GET request listing. */
router.get('/getRequestList', auth.isAuthenticated, function (req, res) {

    var request = new Request();
    var paransQuery = paransBuilder.createParansModel(req.query);

    if (req.session.loggeduser.isAgent)
        paransQuery.agentCode = req.session.loggeduser.userCode;

    if (req.session.loggeduser.isClient)
        paransQuery.clientCode = req.session.loggeduser.clientCode;

    request.getRequest(paransQuery).then(function (requestList) {
        var result = {};
        if (requestList) {
            result = paransBuilder.createParansResponse(requestList, req);
        }

        res.send(result);
        res.end();
    }).catch(function (err) {
        console.log(err);
        res.send({
            message: err.message,
            type: 'danger'
        });
        res.end();
    });
});

/* GET items listing. */
router.get('/items/getRequestItemsList', auth.isAuthenticated, function (req, res) {

    var requestItem = new RequestItem();
    var paransQuery = paransBuilder.createParansModel(req.query);
    
    requestItem.getRequestItems(paransQuery).then(function (requestItemList) {
        var result = {};
        if (requestItemList) {
            result = paransBuilder.createParansResponse(requestItemList, req);
        }

        res.send(result);
        res.end();
    }).catch(function (err) {
        console.log(err);
        res.send({
            message: err.message,
            type: 'danger'
        });
        res.end();
    });
});

router.post('/updateRequest', auth.isAuthenticated, function (req, res) {

    if (req.session.loggeduser.isAdmin) {
        var request = new Request();
        request.getByCode(req.body.request).then(function (request) {
            request.updateAttributes({
                sts_pedido: req.body.request.status
            }).then(function () {

                sendEmailStatusChanged(req, function (err) {
                    if (err) {
                        res.send({
                            message: 'Erro envio de email ' + err.message,
                            type: 'danger'
                        });
                    }

                    res.send(paransBuilder.updateMessageToResponse());
                    res.end();
                });

            }).catch(function (err) {
                res.send(paransBuilder.updateMessageToResponse(err));
                console.log(err);
                res.end();
            });
        });
    }
});

/* GET status listing. */
router.get('/getRequestStatusOptions', auth.isAuthenticated, function (req, res) {

    var refCodes = new RefCodes();

    refCodes.getValuesByDomain("STATUS_PEDIDO").then(function (domainValues) {
        res.send(domainValues);
    }).catch(function (err) {
        console.log(err.message);
    });
});

/* GET user pode editar contéudo tela */
router.get('/getCanEdit', auth.isAuthenticated, function (req, res) {

    //Tela só pode ser editada se usuário logado é administrador
    res.send({ canEdit: req.session.loggeduser.isAdmin });
    res.end();
});

module.exports = router;

/**
 * Rotina manda emails após a efetivação do pedido
 * @param {Objeto da requisição} req
 */

var sendEmailStatusChanged = function (req, next) {
    var parameter = new Parameters();
    parameter.getByCode(req.session.loggeduser).then(function (parameter) {
        if (parameter && parameter.dataValues) {

            var client = new Client();
            client.getMail(req.body.request.clientCode).then(function (client) {

                //Nome da empresa(Fábrica)
                var companyName = parameter.dataValues.nom_fantasia;

                var mail = new Mail(req);
                mail.options.to = client.dataValues.clientMail;
                mail.options.from = parameter.dataValues.email_remetente;
                mail.options.subject = companyName + " Suporte";
                mail.options.html = "<h1>Prezado " + client.dataValues.clientName + "</h1>";
                mail.options.html += "<p>O status do seu pedido foi modificado para " + req.body.request.statusDesc + ".</p>";
                mail.options.html += "<p>Caso tenha alguma dúvida, por favor entre em contato.</p>";

                mail.sendMail(mail.options, function (info, err) {
                    if (err) {
                        return next(err);
                    }

                    return next(null);
                });
            });
        }
    });
}
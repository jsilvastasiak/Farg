'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Client = require('../../model/clientModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/clients', { title: 'Clientes' });
});

router.get('/client-control', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/client-control');
});

/* GET users listing. */
router.get('/getClientList', auth.isAuthenticated, function (req, res) {

    var client = new Client();
    var paransQuery = paransBuilder.createParansModel(req.query);

    client.getClientList(paransQuery).then(function (clientList) {
        var result = {};
        if (clientList) {
            result = paransBuilder.createParansResponse(clientList, req);
        }

        res.send(result);
    }).catch(function (err) {
        new Error(err);
    });
});

router.post('/updateClient', auth.isAuthenticated, function (req, res) {

    var client = new Client();
    client.getByCode(req.body.client.code).then(function (client) {
        client.updateAttributes({
            nom_cliente: req.body.client.clientName,
            tip_pessoa: req.body.client.personType,
            nro_cnpj: req.body.client.cnpjNumber,
            nro_cpf: req.body.client.cpfNumber,
            per_desconto: req.body.client.discountValue
        }).then(function () {
            res.send("Registro Atualizado com sucesso!");
            res.end();

        }).catch(function (err) {
            console.log(err);
        });
    });
});

router.post('/insertClient', auth.isAuthenticated, function (req, res) {

    var client = new Client();
    //Código do agente, será do agente logado no momento
    req.body.client.agentCode = req.session.loggeduser.userCode;

    client.insertClient(req.body.client).then(
        function (data) {
            res.send("Registro inserido com sucesso!");
            res.end();
        }).catch(function (err) {
            res.send(500, err.message);
            res.end();
            console.log(err.message);
        });    
});

router.post('/deleteClient', auth.isAuthenticated, function (req, res) {

    var client = new Client();
    client.getDefinition().then(function (client) {
        client.destroy({
            returning: true,
            where: {
                cdg_cliente: req.body.client.code
            }
        }).then(function (instance) {
            res.send(paransBuilder.deleteMessageToResponse(instance));
            res.end();
        }).catch(function (err) {
            res.send(paransBuilder.deleteMessageToResponse(instance, err));
            console.log(err);
        });
    });
});

module.exports = router;
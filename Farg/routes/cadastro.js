'use strict';
var express = require('express');
var router = express.Router();
var User = require('../model/userModel');
var Client = require('../model/clientModel');
var auth = require('../model/authenticate/authenticate');

router.get('/', function (req, res) {
    //req.body.user = {};
    //req.body.user.nom_login = 'AGENTE';
    //req.body.user.snh_usuario = '1234';
    //req.body.user.idc_administrador = 'S';
    //req.body.user.idc_representante = 'N';
    //req.body.user.idc_cliente = 'N';
    //req.body.user.idc_ativo = 'A';
    
    //var user = new User();
    //user.getByCode(1).then(function (user) {
    //    return user.updateAttributes({
    //        nom_login: req.body.user.nom_login,
    //        snh_usuario: req.body.user.snh_usuario,
    //        idc_administrador: req.body.user.idc_administrador,
    //        idc_representante: req.body.user.idc_representante,
    //        idc_cliente: req.body.user.idc_cliente,
    //        idc_ativo: req.body.user.idc_ativo
    //    });
    //});

    var client = new Client();
    client.getDefinition().then(function (client) {
        res.send('Tabela Clientes Criada');
    });
});

module.exports = router;
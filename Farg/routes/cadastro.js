'use strict';
var express = require('express');
var router = express.Router();
var User = require('../model/userModel');
var Client = require('../model/clientModel');
var ProductImage = require('../model/productImageModel');
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

    //var client = new Client();
    //client.testeData().then(function (result) {
    //    res.send(result);
    //    res.end();
    //});

    //var productImage = new ProductImage();
    //productImage.getDefinition().then(function (result) {
    //    result.max('cdg_imagem', {
    //        where: {
    //            cdg_produto: 1
    //        }
    //    }).then(max => {
    //        result.create({
    //            cdg_produto: 1,
    //            cdg_imagem: (max ? max : 0) + 1,
    //            idc_ativo: 'A'
    //        });

    //        res.send((max ? max : 0) + 1);
    //    });
    //});
});

module.exports = router;
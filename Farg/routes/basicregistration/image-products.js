'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var ImageProduct = require('../../model/productImageModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

router.get('/getImagesList', auth.isAuthenticated, function (req, res) {

    var imageProduct = new ImageProduct();
    var paransQuery = paransBuilder.createParansModel(req.query);

    imageProduct.getAddressClientList(paransQuery).then(function (imageProductList) {
        var result = {};
        if (imageProductList) {
            result = paransBuilder.createParansResponse(imageProductList, req);
        }

        res.send(result);
        res.end();
    }).catch(function (err) {
        new Error(err);
    });
});

router.get('/getAddressTypeOptions', auth.isAuthenticated, function (req, res) {

    var refCodes = new RefCodes();

    refCodes.getValuesByDomain("TIPO_ENDERECO").then(function (domainValues) {
        res.send(domainValues);
        res.end();
    }).catch(function (err) {
        res.send({
            message: 'Erro ao selecionar AddressTypeOptions ' + err.message,
            type: 'danger'
        });
        res.end();
        console.log(err);
    });
});

router.post('/updateAddress', auth.isAuthenticated, function (req, res) {

    var addressClient = new AddressClient();
    addressClient.getByCode(req.body.address).then(function (clientAddress) {
        clientAddress.updateAttributes({
            tip_endereco: req.body.address.addressType,
            nro_cep: req.body.address.cepNumber,
            sgl_estado: req.body.address.uf,
            nom_cidade: req.body.address.cityName,
            nom_bairro: req.body.address.districtName,
            nom_rua: req.body.address.streetName,
            nro_end: req.body.address.streetNumber,
            cpl_end: req.body.address.compAddress,
            ddd_fon_pri: req.body.address.priDDDNumber,
            nro_fon_pri: req.body.address.priFoneNumber,
            ddd_fon_sec: req.body.address.secDDDNumber,
            nro_fon_sec: req.body.address.secFoneNumber,
            ddd_celular: req.body.address.celDDDNumber,
            nro_celular: req.body.address.celFoneNumber
        }).then(function () {
            res.send(paransBuilder.updateMessageToResponse());
        }).catch(function (err) {
            res.send(paransBuilder.updateMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/insertAddress', auth.isAuthenticated, function (req, res) {

    var addressClient = new AddressClient();

    addressClient.getDefinition().then(function (clientAddress) {
        clientAddress.create({
            cdg_cliente: req.body.address.clientCode,
            tip_endereco: req.body.address.addressType,
            nro_cep: req.body.address.cepNumber,
            sgl_estado: req.body.address.uf,
            nom_cidade: req.body.address.cityName,
            nom_bairro: req.body.address.districtName,
            nom_rua: req.body.address.streetName,
            nro_end: req.body.address.streetNumber,
            cpl_end: req.body.address.compAddress,
            ddd_fon_pri: req.body.address.priDDDNumber,
            nro_fon_pri: req.body.address.priFoneNumber,
            ddd_fon_sec: req.body.address.secDDDNumber,
            nro_fon_sec: req.body.address.secFoneNumber,
            ddd_celular: req.body.address.celDDDNumber,
            nro_celular: req.body.address.celFoneNumber
        }).then(function () {
            res.send(paransBuilder.insertMessageToResponse());
            res.end();

        }).catch(function (err) {
            res.send(paransBuilder.insertMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/deleteAddress', auth.isAuthenticated, function (req, res) {

    var addressClient = new AddressClient();
    addressClient.getDefinition().then(function (address) {
        client.destroy({
            returning: true,
            where: {
                cdg_cliente: req.body.clientCode,
                cdg_endereco: req.body.addressCode
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
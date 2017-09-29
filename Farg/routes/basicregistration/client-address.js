'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var AddressClient = require('../../model/clientAddressModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

router.get('/client-address', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/client-address');
});

router.get('/getAddressList', auth.isAuthenticated, function (req, res) {

    var addressClient = new AddressClient();
    var paransQuery = paransBuilder.createParansModel(req.query);

    addressClient.getAddressClientList(paransQuery).then(function (addressList) {
        var result = {};
        if (addressList) {
            result = paransBuilder.createParansResponse(addressList, req);
        }

        res.send(result);
        res.end();
    }).catch(function (err) {
        new Error(err);
    });
});

router.post('/updateAddress', auth.isAuthenticated, function (req, res) {

    var addressClient = new AddressClient();
    addressClient.getByCode(req.body.address).then(function (clientAddress) {
        clientAddress.updateAttributes({
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
            tip_endereco: req.body.address.adressType,
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
                cdg_cliente: req.body.parans.clientCode,
                tip_endereco: req.body.parans.adressType
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
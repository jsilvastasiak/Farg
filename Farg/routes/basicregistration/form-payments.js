'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var FormPayment = require('../../model/formPaymentModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/form-payments', { title: 'Formas de Pagamento' });
});

/* GET users listing. */
router.get('/getFormPaymentsList', auth.isAuthenticated, function (req, res) {

    var formPayment = new FormPayment();
    var paransQuery = paransBuilder.createParansModel(req.query);

    formPayment.getFormPayments(paransQuery).then(function (formPaymentsList) {
        var result = {};
        if (formPaymentsList) {
            result = paransBuilder.createParansResponse(formPaymentsList, req);
        }

        res.send(result);
    }).catch(function (err) {
        console.log(err);
    });
});

router.post('/updateFormPayment', auth.isAuthenticated, function (req, res) {

    var formPayment = new FormPayment();
    formPayment.getByCode(req.body.formPayment).then(function (formPayment) {
        formPayment.updateAttributes({
            dsc_forma: req.body.formPayment.descForm,
            per_desconto: req.body.formPayment.discountValue,
            idc_ativo: req.body.formPayment.idcActive
        }).then(function () {
            res.send(paransBuilder.updateMessageToResponse());
            res.end();

        }).catch(function (err) {
            res.send(paransBuilder.updateMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/insertFormPayment', auth.isAuthenticated, function (req, res) {

    var formPayment = new FormPayment();

    formPayment.getDefinition().then(function (formPayment) {
        formPayment.create({
            dsc_forma: req.body.formPayment.descForm,
            per_desconto: req.body.formPayment.discountValue,
            idc_ativo: req.body.formPayment.idcActive
        }).then(function () {
            res.send(paransBuilder.insertMessageToResponse());
            res.end();
        }).catch(function (err) {
            res.send(paransBuilder.insertMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/deleteFormPayment', auth.isAuthenticated, function (req, res) {

    var formPayment = new FormPayment();
    formPayment.getDefinition().then(function (formPayment) {
        formPayment.destroy({
            returning: true,
            where: {
                cdg_forma: req.body.formPayment.code
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

/* GET users listing. */
router.get('/getFormPaymentStatusOptions', auth.isAuthenticated, function (req, res) {

    var refCodes = new RefCodes();

    refCodes.getValuesByDomain("ACTIVE_INACTIVE").then(function (domainValues) {
        res.send(domainValues);
    }).catch(function (err) {
        new Error(err);
    });
});

module.exports = router;
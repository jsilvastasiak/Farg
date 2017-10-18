'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Product = require('../../model/productModel');
var ProductImage = require('../../model/productImageModel');
var Grade = require('../../model/gradeModel');
var PaymentForm = require('../../model/formPaymentModel');
var paransBuilder = require('../common/paransBuilder');
var ClientSession = require('../common/client-session');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('client/client-products', { title: 'Produtos' });
});

router.get('/info', auth.isAuthenticated, function (req, res) {
    res.render('client/client-product-info', { title: 'Detalhes' });
});

/* GET Lista de produtos cadastradas. */
router.get('/getProductsList', auth.isAuthenticated, function (req, res) {

    var product = new Product();
    var paransQuery = paransBuilder.createParansModel(req.query);

    paransQuery.client = {
        icmsCode: 8,
        code: req.session.loggeduser.isClient ? req.session.loggeduser.userCode : null
    };

    product.getClientProducts(paransQuery).then(function (productList) {
        var info = {};
        if (productList) {
            info = paransBuilder.createParansResponse(productList, req);
        }

        var clientSession = new ClientSession(req);
        for (var i = 0; i < info.result.length; i++) {
            var carItem = clientSession.getCarItem(info.result[i].productCode);
            if (carItem) {
                info.result[i].quantity = carItem.quantity;
                info.result[i].selectedGrade = carItem.gradeCode.toString();
                info.result[i].inSession = true;
            }
        }

        res.send(info);
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

/* GET Opções de grade cadastradas. */
router.get('/getGradesOptions', auth.isAuthenticated, function (req, res) {
    
    var grade = new Grade();
    var paransQuery = paransBuilder.createParansModel(req.query);
    paransQuery.idcActive = 'A';

    grade.getGrades(paransQuery).then(function (gradesList) {
        var result = {};
        if (gradesList) {
            result = paransBuilder.createParansResponse(gradesList, req);
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

/* GET formas de pagamento cadastradas. */
router.get('/getPaymentFormOptions', auth.isAuthenticated, function (req, res) {

    var paymentForm = new PaymentForm();
    var paransQuery = paransBuilder.createParansModel(req.query);
    paransQuery.idcActive = 'A';

    paymentForm.getFormPayments(paransQuery).then(function (paymentFormList) {
        var result = {};
        if (paymentFormList) {
            result = paransBuilder.createParansResponse(paymentFormList, req);
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

/* GET todas imagens de um determinado produto. */
router.get('/info/getImages', auth.isAuthenticated, function (req, res) {

    var productImage = new ProductImage();
    var paransQuery = paransBuilder.createParansModel(req.query);

    if (req.query.id) {
        paransQuery.code = req.query.id;

        productImage.getImageProducts(paransQuery).then(function (productImageList) {
            var result = {};
            if (productImageList) {
                result = paransBuilder.createParansResponse(productImageList, req);
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
    } else {
        res.send({
            message: 'Nenhum parâmetro informado',
            type: 'danger'
        });
        res.end();
    }
});

/* GET informações do item selecionado. */
router.get('/info/getInfo', auth.isAuthenticated, function (req, res) {

    var product = new Product();
    var paransQuery = paransBuilder.createParansModel(req.query);

    if (req.query.id) {
        paransQuery.code = req.query.id;
        paransQuery.client = { icmsCode: 8 };

        product.getClientProducts(paransQuery).then(function (productList) {
            var result = {};
            if (productList) {
                result = paransBuilder.createParansResponse(productList, req);
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
    } else {
        res.send({
            message: 'Nenhum parâmetro informado',
            type: 'danger'
        });
        res.end();
    }
});

/* POST adiciona item selecionado na tela para carrinho usuário*/
router.post('/addItem', auth.isAuthenticated, function (req, res) {

    /*Medida de segurança:
        Será necessário buscar os valores do produto vindo pela requisição novamente na base e
        refazer o cálculo do preço, pois se o sistema for vítima de ataque onde o indíviduo conseguir
        chamar esse método post com o valor do produto alterado do client, o sistema gerará o pedido com
        o preço alterado. Complicando a fábrica.
        Porém as opções selecionadas na tela valerão para que o cálculo sejam efetuados.
    */
    if (req.body.product) {
        
        //Grava item para sessão
        calculateItemToCar(req, function (item, err) {
            if (err)
                res.send(err);
            else {
                var clientSession = new ClientSession(req);
                clientSession.addCarItem(item);
            }

            res.end();
        });        
    }
});

router.post('/editItem', auth.isAuthenticated, function (req, res) {

    /*Medida de segurança:
        Será necessário buscar os valores do produto vindo pela requisição novamente na base e
        refazer o cálculo do preço, pois se o sistema for vítima de ataque onde o indíviduo conseguir
        chamar esse método post com o valor do produto alterado do client, o sistema gerará o pedido com
        o preço alterado. Complicando a fábrica.
        Porém as opções selecionadas na tela valerão para que o cálculo sejam efetuados.
    */
    if (req.body.product) {
        //Grava item para sessão
        calculateItemToCar(req, function (item, err) {
            if (err)
                res.send(err);
            else {
                var clientSession = new ClientSession(req);
                clientSession.editCarItem(item);
            }

            res.end();
        });
    }
});

router.post('/removeItem', auth.isAuthenticated, function (req, res) {

    /*Medida de segurança:
        Será necessário buscar os valores do produto vindo pela requisição novamente na base e
        refazer o cálculo do preço, pois se o sistema for vítima de ataque onde o indíviduo conseguir
        chamar esse método post com o valor do produto alterado do client, o sistema gerará o pedido com
        o preço alterado. Complicando a fábrica.
        Porém as opções selecionadas na tela valerão para que o cálculo sejam efetuados.
    */
    if (req.body.product.code) {
        var clientSession = new ClientSession(req);
        clientSession.removeCarItem(req.body.product);

    } else {
        res.send({
            message: 'Parâmetros para adição do item não informados',
            type: 'danger'
        });
    }

    res.end();
});

module.exports = router;

var calculateItemToCar = function (req, next) {
    var parans = {
        gradeCode: req.body.product.gradeCode,
        quantity: req.body.product.quantity,
        paymentFormCode: req.body.product.paymentFormCode
    };

    var gradeCode = req.body.product.gradeCode;
    var quantity = req.body.product.quantity;
    var paymentFormCode = req.body.product.paymentFormCode;

    if (!gradeCode || !quantity || !paymentFormCode)
        next(null, {
            message: 'Parâmetros para adição do item não informados',
            type: 'danger'
        });
    else {
        var product = new Product();

        product.getParansProduct({
            code: req.body.product.code,
            icmsCode: req.session.loggeduser.icmsCode,
            clientCode: req.session.loggeduser.clientCode,
            gradeCode: gradeCode,
            paymentFormCode: paymentFormCode
        }).then(function (parans) {

            if (parans.length > 0) {
                var item = parans[0];
                var discountGrade = item.productValue * item.discountGrade;
                var discountPaymentForm = item.productValue * item.discountPaymentForm;
                var discountClient = item.productValue * item.discountClient;

                //Valor final para unidade do produto
                var unitFinalValue = item.productValue - discountClient - discountGrade - discountPaymentForm;

                next({
                    productCode: req.body.product.code,
                    gradeCode: gradeCode,
                    quantity: quantity,
                    unitValue: unitFinalValue,
                    paymentForm: paymentFormCode
                });

            } else {
                next(null, {
                    message: 'Informações do produto não encontradas',
                    type: 'danger'
                });
            }
        });
    }
};
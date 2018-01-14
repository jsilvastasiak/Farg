'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Product = require('../../model/productModel');
var ProductImage = require('../../model/productImageModel');
var Grade = require('../../model/gradeModel');
var PaymentForm = require('../../model/formPaymentModel');
var Category = require('../../model/categoryModel');
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
        icmsCode: req.session.loggeduser.icmsCode,
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

router.get('/getProductGradeOptions', auth.isAuthenticated, function (req, res) {

    if (req.query.product || req.query.filters) {
        var grade = new Grade();
        var paransQuery = JSON.parse(req.query.product ? req.query.product : req.query.filters);
        paransQuery.idcActive = 'A';
    
        grade.getProductGrades(paransQuery).then(function (gradesList) {
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
    } else {
        console.log("Nenhum filtro informado");
        res.send({
            message: 'Nenhum filtro de produto informado',
            type: 'danger'
        });
        res.end();
    }
});

/* GET users listing. */
router.get('/getCategorys', auth.isAuthenticated, function (req, res) {

    var category = new Category();

    category.getCategorys({
        idcActive: 'A'
    }).then(function (categorysList) {
        var result = {};
        if (categorysList) {
            result = paransBuilder.createParansResponse(categorysList, req);
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
        paransQuery.client = {
            code: req.session.loggeduser.isClient ? req.session.loggeduser.userCode : null,
            icmsCode: req.session.loggeduser.icmsCode
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
    } else {
        res.send({
            message: 'Nenhum parâmetro informado',
            type: 'danger'
        });
        res.end();
    }
});

/* GET informações da forma de pagamento selecionada. */
router.get('/getPaymentForm', auth.isAuthenticated, function (req, res) {
    //Seta forma de pagamento caso ainda não exista para o carrinho do usuário
    res.send(req.session.loggeduser.car.paymentForm);
    res.end();    
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
        if (!req.session.loggeduser.car.paymentForm) {
            res.send({
                message: 'Forma de pagamento não selecionada',
                type: 'danger'
            });
            res.end();
        }
        else {
            //Grava item para sessão
            calculateItemToCar(req, req.body.product, function (item, err) {
                if (err)
                    res.send(err);
                else {
                    var clientSession = new ClientSession(req);
                    clientSession.addCarItem(item);
                }

                res.end();
            });
        }

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
        calculateItemToCar(req, req.body.product, function (item, err) {
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

/* POST salva forma de pagamento selecionada na seção*/
router.post('/setPaymentForm', auth.isAuthenticated, function (req, res) {    
    if (req.body.paymentForm) {
        req.session.loggeduser.car.paymentForm = req.body.paymentForm;

        var clientSession = new ClientSession(req);
        var itemList = clientSession.getCarItemList();

        if (itemList.length > 0) {
            req.body.itensCarCount = itemList.length;
            req.body.errors = [];
            //Remove todos items do carrinho até o momento
            clientSession.clearCarItems();

            for (var i = 0; i < itemList.length; i++) {
                var product = {
                    code: itemList[i].productCode,
                    quantity: itemList[i].quantity,
                    paymentFormCode: req.body.paymentForm.code,
                    gradeCode: itemList[i].gradeCode
                };
                calculateItemToCar(req, product, function (item, err) {
                    if (err) {
                        req.body.errors.push(err);
                    }
                    else {
                        var clientSession = new ClientSession(req);
                        clientSession.addCarItem(item);
                    }

                    req.body.itensCarCount--;
                    if (req.body.itensCarCount === 0) {
                        if (req.body.errors.length > 0) {
                            res.status(500);
                            res.send(req.body.errors[0]);
                        }

                        res.end();
                    }
                });
            }
        } else {
            res.end();
        }

    } else {
        res.end();
    } 
});
//Capturar erros de código
router.use(function (err, req, res, next) {
    if (err) {
        res.status(500);
        res.send({
            message: err.message,
            type: 'danger'
        });
        res.end();
    } else {
        next();
    }
});

module.exports = router;

var calculateItemToCar = function (req, product, next) {
    var parans = {
        gradeCode: product.gradeCode,
        quantity: product.quantity,
        paymentFormCode: product.paymentFormCode
    };

    var productCode = product.code;
    var gradeCode = product.gradeCode;
    var quantity = product.quantity;
    var paymentFormCode = product.paymentFormCode;

    if (!gradeCode || !quantity || !paymentFormCode)
        next(null, {
            message: 'Parâmetros para adição do item não informados',
            type: 'danger'
        });
    else {
        var product = new Product();

        product.getParansProduct({
            code: productCode,
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
                    productCode: productCode,
                    gradeCode: gradeCode,
                    quantity: quantity,
                    unitValue: parseFloat(unitFinalValue.toFixed(2)),
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
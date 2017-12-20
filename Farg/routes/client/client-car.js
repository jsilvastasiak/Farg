'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Product = require('../../model/productModel');
var Request = require('../../model/requestModel');
var RequestItem = require('../../model/requestItemsModel');
var ProductImage = require('../../model/productImageModel');
var Grade = require('../../model/gradeModel');
var PaymentForm = require('../../model/formPaymentModel');
var Category = require('../../model/categoryModel');
var Mail = require('../../model/common/mail');
var Parameters = require('../../model/parametersModel');
var paransBuilder = require('../common/paransBuilder');
var ClientSession = require('../common/client-session');
var Sequelize = require('../../model/connectionFactory');

var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('client/client-car', { title: 'Carrinho' });
});

router.get('/request-effetive', auth.isAuthenticated, function (req, res) {
    res.render('client/request-effetive', { title: 'Pedido Efetivado' });
});

router.get('/request-fail', auth.isAuthenticated, function (req, res) {
    res.render('client/request-fail', { title: 'Ocorreu um problema' });
});

/* GET Lista de produtos cadastradas. */
router.get('/getCarItemList', auth.isAuthenticated, function (req, res) {

    var clientSession = new ClientSession(req);    
    var product = new Product();
    var info = {};
    var itemsList = clientSession.getCarItemList();
    var parans = {};
    
    info = paransBuilder.createParansResponse(itemsList, req);
        
    res.send(info);
    res.end();
});

/* GET Lista de produtos cadastradas. */
router.get('/getCarItemInfo', auth.isAuthenticated, function (req, res) {

    var clientSession = new ClientSession(req);
    var product = new Product();
    var info = {};
    //Concatena códigos dos produtos no carrinho do cliente
    var itemsList = clientSession.getCarItemList();
    var codesList = "";

    for (var i = 0; i < itemsList.length; i++) {
        codesList += itemsList[i].productCode + ",";
    }
    
    var parans = {
        codesList: codesList.substring(0, codesList.length - 1)
    };

    if (parans.codesList) {
        product.getCarProducts(parans).then(function (result) {
            if (result) {
                res.send(result);
            }

            res.end();
        });
    } else {
        res.end();
    }
});

/* GET Opções de grade cadastradas. */
router.get('/getPaymentFormList', auth.isAuthenticated, function (req, res) {

    var paymentForm = new PaymentForm();
    var paransQuery = paransBuilder.createParansModel(req.query);
    paransQuery.idcActive = 'A';

    paymentForm.getFormPayments(paransQuery).then(function (paymentFormList) {
        var result = {};
        if (paymentFormList) {
            result = paransBuilder.createParansResponse(paymentFormList, req);
        }

        var clientSession = new ClientSession(req);
        var selectedPaymentForm = clientSession.getPaymentFormSelected();
        var selectedPaymentCode = selectedPaymentForm ? selectedPaymentForm.code : null;

        for (var i = 0; i < result.result.length; i++) {
            result.result[i].isSelected = result.result[i].code === selectedPaymentCode;
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

router.post('/editItem', auth.isAuthenticated, function (req, res) {

    /*Medida de segurança:
        Será necessário buscar os valores do produto vindo pela requisição novamente na base e
        refazer o cálculo do preço, pois se o sistema for vítima de ataque onde o indíviduo conseguir
        chamar esse método post com o valor do produto alterado do client, o sistema gerará o pedido com
        o preço alterado. Complicando a fábrica.
        Porém as opções selecionadas na tela valerão para que o cálculo sejam efetuados.
    */
    if (req.body.product) {
        var clientCar = new ClientSession(req);
        //Grava item para sessão
        clientCar.calculateItemToCar(req, function (item, err, clientSession) {
            if (err)
                res.send(err);
            else {                
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

/* POST salva sessao do usuário na base. */
router.post('/effetiveRequest', auth.isAuthenticated, function (req, res) {

    //Função trata o erro em qualquer ponto da transação
    var errorHandler = function (err) {
        console.log('Erro ao salvar items do pedido');
        console.log(err);
        res.send({
            status: 1,
            message: err.message,
            type: 'danger'
        });
        res.end();
    };

    //Função de manipulação caso sucesso da efetivação
    var successHandler = function (mailErr) {
        if (mailErr) {
            res.send({
                message: mailErr.message,
                type: 'danger'
            });
        }

        var clientSession = new ClientSession(req);
        clientSession.clearCarItems();

        res.send({
            status: 0,
            message: 'Pedido efetivado com sucesso',
            type: 'success'
        });
        res.end();
    }

    if (new ClientSession(req).getCarItemList().length > 0) {
        Sequelize.transaction().then(function (t) {

            var request = new Request();
            request.getDefinition().then(function (request) {
                //Cria pedido
                request.max('cdg_pedido', {
                    where: {
                        cdg_cliente: req.session.loggeduser.clientCode
                    }
                }).then(max => {
                    request.create({
                        cdg_pedido: (max ? max : 0) + 1,
                        cdg_cliente: req.session.loggeduser.clientCode,
                        cdg_forma: req.session.loggeduser.car.paymentForm.code,
                        dta_pedido: Date(),
                        sts_pedido: 'A'
                    }, { transaction: t }).then(function (request) {
                        //Depois de criar o pedido, inicia a criação de items do pedido
                        var requestItem = new RequestItem();
                        requestItem.getDefinition().then(function (requestItem) {
                            //Cada item do carrinho vira um registro
                            var clientSession = new ClientSession(req);
                            var itemsList = clientSession.getCarItemList();
                            //Contador de items do carrinho
                            req.body.itemsCar = itemsList.length;

                            for (var i = 0; i < itemsList.length; i++) {
                                requestItem.create({
                                    cdg_item: i + 1,
                                    cdg_pedido: request.cdg_pedido,
                                    cdg_cliente: req.session.loggeduser.clientCode,
                                    cdg_produto: itemsList[i].productCode,
                                    vlr_atribuido: itemsList[i].unitValue,
                                    qtd_grade: itemsList[i].quantity,
                                    cdg_grade: itemsList[i].gradeCode
                                }, {
                                        transaction: t
                                    }).then(function (requestItem) {
                                        //vai decrementando o contador de items do carrinho 
                                        req.body.itemsCar--;
                                        //quando o contador chegar a zero, indica que este é o último
                                        //item
                                        if (req.body.itemsCar == 0) {
                                            t.commit().then(function (result) {
                                                //Manda email após efetivação do pedido e chama função para terminar requisição
                                                sendEmailRequestEffectived(req, successHandler);
                                            });
                                        }
                                    })
                                    .catch(function (err) {
                                        t.rollback().then(function (result) {
                                            errorHandler(err);
                                        })
                                    });
                            }
                        });
                    }).catch(function (err) {
                        t.rollback().then(function (result) {
                            errorHandler(err);
                        });
                    });
                });
            });

        });
    } else {
        res.send({
            message: 'Não existem items no carrinho.',
            type: 'alert'
        });
        res.end();
    }
});

/* POST salva forma de pagamento selecionada na seção*/
router.post('/setPaymentForm', auth.isAuthenticated, function (req, res) {
    if (req.body.paymentForm) {
        req.session.loggeduser.car.paymentForm = req.body.paymentForm;
    }
    res.end();
});

module.exports = router;

/**
 * Rotina manda emails após a efetivação do pedido
 * @param {Objeto da requisição} req
 */

var sendEmailRequestEffectived = function (req, next) {
    var parameter = new Parameters();
    parameter.getByCode(req.session.loggeduser).then(function (parameter) {
        if (parameter && parameter.dataValues) {
            //Nome da empresa(Fábrica)
            var companyName = parameter.dataValues.nom_fantasia;

            var mail = new Mail(req);
            mail.options.to = req.session.loggeduser.clientMail;
            mail.options.from = parameter.dataValues.email_remetente;
            mail.options.subject = companyName + " Suporte";
            mail.options.html = "<h1>Prezado " + req.session.loggeduser.clientName + "</h1>";
            mail.options.html += "<p>Seu pedido foi efetivado e enviado para fábrica.</p>";
            mail.options.html += "<p>Obrigado pela preferência.</p>";

            mail.sendMail(mail.options, function (info, err) {
                if (err) {
                    return next(err);
                }

                return next(null);
            });
        }
    });

}
'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Product = require('../../model/productModel');
var Category = require('../../model/categoryModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/products', { title: 'Produtos' });
});

router.get('/image-products', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/image-products');
});

router.get('/image-control', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/products-control');
});

/* GET users listing. */
router.get('/getProductsList', auth.isAuthenticated, function (req, res) {

    var product = new Product();
    var paransQuery = paransBuilder.createParansModel(req.query);

    product.getProducts(paransQuery).then(function (productList) {
        var result = {};
        if (productList) {
            result = paransBuilder.createParansResponse(productList, req);
        }

        res.send(result);
    }).catch(function (err) {
        console.log(err);
    });
});

router.post('/updateProduct', auth.isAuthenticated, function (req, res) {

    var product = new Product();
    product.getByCode(req.body.product).then(function (product) {
        product.updateAttributes({
            cdg_categoria: req.body.product.categoryCode,
            nom_produto: req.body.product.productName,
            idc_ativo: req.body.product.idcActive
        }).then(function () {
            res.send(paransBuilder.updateMessageToResponse());
            res.end();

        }).catch(function (err) {
            res.send(paransBuilder.updateMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/insertProduct', auth.isAuthenticated, function (req, res) {

    var product = new Product();

    product.getDefinition().then(function (product) {
        product.create({
            cdg_categoria: req.body.product.categoryCode,
            nom_produto: req.body.product.productName,
            idc_ativo: req.body.category.idcActive
        }).then(function () {
            res.send(paransBuilder.insertMessageToResponse());
            res.end();
        }).catch(function (err) {
            res.send(paransBuilder.insertMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/deleteProduct', auth.isAuthenticated, function (req, res) {

    var product = new Product();
    product.getDefinition().then(function (product) {
        product.destroy({
            returning: true,
            where: {
                cdg_produto: req.body.product.code
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
router.get('/getProductStatusOptions', auth.isAuthenticated, function (req, res) {

    var refCodes = new RefCodes();

    refCodes.getValuesByDomain("ACTIVE_INACTIVE").then(function (domainValues) {
        res.send(domainValues);
    }).catch(function (err) {
        console.log(err.message);
    });
});

/* GET users listing. */
router.get('/getCategorys', auth.isAuthenticated, function (req, res) {

    var category = new Category();

    category.getCategorys({
        filters: {
            idcActive: 'A'
        }
    }).then(function (categorysList) {
        res.send(categorysList);
    }).catch(function (err) {
        console.log(err.message);
    });
});

module.exports = router;
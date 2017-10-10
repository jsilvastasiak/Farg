'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Product = require('../../model/productModel');
var Grade = require('../../model/gradeModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('client/client-products', { title: 'Produtos' });
});

/* GET users listing. */
router.get('/getProductsList', auth.isAuthenticated, function (req, res) {

    var product = new Product();
    var paransQuery = paransBuilder.createParansModel(req.query);

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
});

/* GET users listing. */
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

module.exports = router;
'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Category = require('../../model/categoryModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/categorys', { title: 'Categorias' });
});

/* GET users listing. */
router.get('/getCategorysList', auth.isAuthenticated, function (req, res) {

    var category = new Category();
    var paransQuery = paransBuilder.createParansModel(req.query);

    category.getCategorys(paransQuery).then(function (categoryList) {
        var result = {};
        if (categoryList) {
            result = paransBuilder.createParansResponse(categoryList, req);
        }

        res.send(result);
    }).catch(function (err) {
        console.log(err);
    });
});

router.post('/updateCategory', auth.isAuthenticated, function (req, res) {

    var category = new Category();
    category.getByCode(req.body.category).then(function (category) {
        category.updateAttributes({
            nom_categoria: req.body.category.categoryName,            
            idc_ativo: req.body.category.idcActive
        }).then(function () {
            res.send(paransBuilder.updateMessageToResponse());
            res.end();

        }).catch(function (err) {
            res.send(paransBuilder.updateMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/insertCategory', auth.isAuthenticated, function (req, res) {

    var category = new Category();

    category.getDefinition().then(function (category) {
        category.create({
            nom_categoria: req.body.category.categoryName,
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

router.post('/deleteCategory', auth.isAuthenticated, function (req, res) {

    var category = new Category();
    category.getDefinition().then(function (category) {
        category.destroy({
            returning: true,
            where: {
                cdg_categoria: req.body.category.code
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
router.get('/getCategoryStatusOptions', auth.isAuthenticated, function (req, res) {

    var refCodes = new RefCodes();

    refCodes.getValuesByDomain("ACTIVE_INACTIVE").then(function (domainValues) {
        res.send(domainValues);
    }).catch(function (err) {
        console.log(err.message);
    });
});

module.exports = router;
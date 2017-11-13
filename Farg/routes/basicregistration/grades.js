'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Grade = require('../../model/gradeModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/grades', { title: 'Grades' });
});

router.get('/grades-control', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/grades-control');
});

router.get('/product-grade', auth.isAuthenticated, function (req, res) {
    res.render('basicregistration/product-grade');
});

/* GET users listing. */
router.get('/getGradesList', auth.isAuthenticated, function (req, res) {

    var grade = new Grade();
    var paransQuery = paransBuilder.createParansModel(req.query);

    grade.getGrades(paransQuery).then(function (gradesList) {
        var result = {};
        if (gradesList) {
            result = paransBuilder.createParansResponse(gradesList, req);
        }

        res.send(result);
    }).catch(function (err) {
        console.log(err);
    });
});

router.post('/updateGrade', auth.isAuthenticated, function (req, res) {

    var grade = new Grade();
    grade.getByCode(req.body.grade).then(function (grade) {
        grade.updateAttributes({
            dsc_grade: req.body.grade.descGrade,
            per_desconto: req.body.grade.discountValue,
            qtd_minima: req.body.grade.minQuantity,
            idc_ativo: req.body.grade.idcActive            
        }).then(function () {
            res.send(paransBuilder.updateMessageToResponse());
            res.end();

        }).catch(function (err) {
            res.send(paransBuilder.updateMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/insertGrade', auth.isAuthenticated, function (req, res) {

    var grade = new Grade();
    
    grade.getDefinition().then(function (grade) {
        grade.create({
            dsc_grade: req.body.grade.descGrade,
            per_desconto: req.body.grade.discountValue,
            qtd_minima: req.body.grade.minQuantity,
            idc_ativo: req.body.grade.idcActive            
        }).then(function () {
            res.send(paransBuilder.insertMessageToResponse());
            res.end();
        }).catch(function (err) {
            res.send(paransBuilder.insertMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/deleteGrade', auth.isAuthenticated, function (req, res) {

    var grade = new Grade();
    grade.getDefinition().then(function (grade) {
        grade.destroy({
            returning: true,
            where: {
                cdg_grade: req.body.grade.gradeCode
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
router.get('/getGradesStatusOptions', auth.isAuthenticated, function (req, res) {

    var refCodes = new RefCodes();

    refCodes.getValuesByDomain("ACTIVE_INACTIVE").then(function (domainValues) {
        res.send(domainValues);
    }).catch(function (err) {
        new Error(err);
    });
});

module.exports = router;
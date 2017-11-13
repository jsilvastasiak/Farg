'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var ProductGrade = require('../../model/productGradeModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');

var router = express.Router();

/* GET users listing. */
router.get('/getGradesList', auth.isAuthenticated, function (req, res) {

    var grade = new ProductGrade();
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

router.post('/updateStatus', auth.isAuthenticated, function (req, res) {

    var grade = new ProductGrade();
    grade.getDefinition().then(function (grade) {
        grade.findOrCreate({
            where: {
                cdg_grade: req.body.productGrade.gradeCode,
                cdg_produto: req.body.productGrade.productCode
            },
            defaults: { idc_habilitado: req.body.productGrade.idcEnable }
        }).spread(function (grade, created) {
            if (!created) {
                user.updateAttributes({
                    idc_habilitado: req.body.productGrade.idcEnable
                }).then(function () {
                    res.send(paransBuilder.updateMessageToResponse());
                    res.end();
                });
            } else {
                res.send(paransBuilder.updateMessageToResponse());
                res.end();
            }
        })
    });    
});

module.exports = router;
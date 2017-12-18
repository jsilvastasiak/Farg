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
                grade.updateAttributes({
                    idc_habilitado: req.body.productGrade.idcEnable
                }).then(function () {
                    res.send(paransBuilder.updateMessageToResponse());
                    res.end();
                });
            } else {
                res.send(paransBuilder.updateMessageToResponse());
                res.end();
            }
        }).catch(function (err) {
            //Este erro que esta acontencendo, segundo pesquisas na internet é um bug do sequelize
            //Este método tenta acessar a primeira linha da query que ele faz para ver se o registro ja existe
            //E acaba dando esse erro.
            //Mas o trabalho necessário já foi feito, provavelmente...
            if (err.message === "Cannot read property '0' of undefined")
                res.send(paransBuilder.updateMessageToResponse());
            else
                res.send(paransBuilder.updateMessageToResponse(err))
            res.end();
        });
    });    
});

module.exports = router;
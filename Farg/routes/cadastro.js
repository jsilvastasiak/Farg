'use strict';
var express = require('express');
var router = express.Router();
var User = require('../model/userModel');
var Client = require('../model/clientModel');
var ProductImage = require('../model/productImageModel');
var Parameters = require('../model/parametersModel');
var Mail = require('../model/common/mail');
var auth = require('../model/authenticate/authenticate');

var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

router.get('/', function (req, res) {    

    var parameter = new Parameters();
    parameter.getByCode(req.session.loggeduser).then(function (parameter) {
        if (parameter && parameter.dataValues) {
            //Nome da empresa(Fábrica)
            var companyName = parameter.dataValues.nom_fantasia;

            var mail = new Mail(req);
            mail.options.to = 'jonas.stasiak@hotmail.com';
            mail.options.from = "suporte@meupedido.uh-app.com.br";
            mail.options.subject = "Farg Suporte";
            mail.options.html = "<h1>Prezado Jonas Stasiak</h1>";
            mail.options.html += "<p>Seu pedido foi efetivado e enviado para fábrica.</p>";
            mail.options.html += "<p>Obrigado pela preferência.</p>";

            mail.sendMail(mail.options, function (info, err) {
                if (err) {
                    res.send(err);
                    res.end();
                } else {
                    res.send(info);
                    res.end();
                }
            });
        } else {
            res.end();
        }
    });

    //res.render('basicregistration/products-control');
});

router.get('/image/:name', function (req, res) {

    var file = ("C:\\Projetos\\E-shopping\\E-shopping\\Front\\loja\\public\\images\\home\\{0}").replace("{0}", req.params.name);

    var type = 'image/jpeg';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function (err) {
        res.set('Content-Type', 'text/plain');
        res.send(err);
    });

});

module.exports = router;
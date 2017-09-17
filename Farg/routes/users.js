'use strict';
var express = require('express');
var auth = require('../model/authenticate/authenticate');
var User = require('../model/userModel');
var RefCodes = require('../model/refcodesModel');
var router = express.Router();

router.get('/', auth.isAuthenticated, function (req, res) {

    res.render('basicregistration/users', { title: 'Usuários' });
});

/* GET users listing. */
router.get('/getUsersList', auth.isAuthenticated, function (req, res) {

    var user = new User();

    user.getUsers().then(function (usersList) {
        res.send(usersList);
    }).catch(function (err) {
        new Error(err);
    });
});

/* GET users listing. */
router.get('/getUserStatusOptions', auth.isAuthenticated, function (req, res) {

    var refCodes = new RefCodes();

    refCodes.getValuesByDomain("ACTIVE_INACTIVE").then(function (domainValues) {
        res.send(domainValues);
    }).catch(function (err) {
        new Error(err);
    });
});

router.post('/updateUser', auth.isAuthenticated, function (req, res) {

    var user = new User();
    user.getByCode(req.body.user.code).then(function (user) {
        user.updateAttributes({
            nom_login: req.body.user.login,
            snh_usuario: req.body.user.password ? req.body.user.password : user.snh_usuario,
            idc_administrador: req.body.user.isAdmin ? 'S' : 'N',
            idc_representante: req.body.user.isAgent ? 'S' : 'N',
            idc_cliente: req.body.user.isClient ? 'S' : 'N',
            idc_ativo: req.body.user.statusUser
        }).then(function () {
            res.send("Registro Atualizado com sucesso!");
            res.end();

        }).catch(function (err) {
            console.log(err);
        });
    });
});

router.post('/insertUser', auth.isAuthenticated, function (req, res) {

    var user = new User();
    user.getDefinition().then(function (user) {
        user.create({
            nom_login: req.body.user.login.toUpperCase(),
            snh_usuario: req.body.user.password,
            idc_administrador: req.body.user.isAdmin ? 'S' : 'N',
            idc_representante: req.body.user.isAgent ? 'S' : 'N',
            idc_cliente: req.body.user.isClient ? 'S' : 'N',
            idc_ativo: req.body.user.statusUser
        }).then(function () {
            res.send("Registro Inserido com sucesso!");
            res.end();

        }).catch(function (err) {
            console.log(err);
        });

    });
});

router.post('/deleteUser', auth.isAuthenticated, function (req, res) {

    var user = new User();
    user.getDefinition().then(function (user) {
        user.destroy({
            where: {
                cdg_usuario: req.body.user.code
            }
        }).then(function () {
            res.send("Registro deletado com sucesso!");
            res.end();
        }).catch(function (err) {
            console.log(err);
        });

    });
});

module.exports = router;

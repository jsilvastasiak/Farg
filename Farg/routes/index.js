'use strict';
var express = require('express');
var auth = require('../model/authenticate/authenticate');
var router = express.Router();
var app = express();

/*Função de redirecionamento*/


/* GET home page. */
router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('index', { title: 'Home' });
});

router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
});

router.get('/getProfile', auth.isAuthenticated, function (req, res) {

    if (req.session.loggeduser.isAdmin)
        res.send({ profile: 'Administrador' });

    if (req.session.loggeduser.isAgent)
        res.send({ profile: 'Representante' });

    if (req.session.loggeduser.isClient)
        res.send({ profile: 'Cliente' });

    res.end();
});

router.post('/login', function (req, res) {
    
    auth.authenticate(req, req.body.userName, req.body.password, function (req, success, msg) {
        if (success) {
            res.send({ redirect: '/' });
        } else {
            res.send({ redirect: '/login', message: msg, type: 'danger' });
        }

        res.end();
    });

});

module.exports = router;
    

    //router.post('/login', function (req, res, next) {
    //    passport.authenticated('login', (err, user) => {
    //        if (err) {
    //            return res.send({ err: err, info: info });
    //        }

    //        res.send(user);

    //    }(req, res, next);
        
    //});
//successRedirect: '/',
//failureRedirect: '/cadastro',
//failureFlash: true
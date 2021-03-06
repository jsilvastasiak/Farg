﻿'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressionSession = require('express-session');
var flash = require('connect-flash');
var cors = require('cors');

/**
 * Manipulação da base de dados ao iniciar sistema sempre
 */
var clientModel = require('./model/clientModel');
var addressClientModel = require('./model/clientAddressModel');
var userModel = require('./model/userModel');
var formPayment = require('./model/formPaymentModel');
var request = require('./model/requestModel');
var category = require('./model/categoryModel');
var product = require('./model/productModel');
var grade = require('./model/gradeModel');
var productImage = require('./model/productImageModel');
var requestItems = require('./model/requestItemsModel');
var parameters = require('./model/parametersModel');
var productGrade = require('./model/productGradeModel');

(new userModel()).getDefinition();
(new clientModel()).getDefinition();
(new addressClientModel()).getDefinition();
(new formPayment()).getDefinition();
(new request()).getDefinition();
(new category()).getDefinition();
(new product()).getDefinition();
(new grade()).getDefinition();
(new productImage()).getDefinition();
(new requestItems()).getDefinition();
(new parameters()).getDefinition();
(new productGrade()).getDefinition();

var app = express();

app.use(cors());

//Parte de autenticação sistema
app.use(expressionSession({
    secret: 'dnfkdn',
    resave: true,
    saveUninitialized: true
}));

//app.use(passport.initialize());
//app.use(passport.session());
//app.use(flash());

var routes = require('./routes/index');
var temporaryFiles = require('./routes/common/temporary-files');
var users = require('./routes/basicregistration/users');
var clients = require('./routes/basicregistration/clients');
var clientAddress = require('./routes/basicregistration/client-address');
var grades = require('./routes/basicregistration/grades');
var formPayments = require('./routes/basicregistration/form-payments');
var categorys = require('./routes/basicregistration/categorys');
var products = require('./routes/basicregistration/products');
var productImages = require('./routes/basicregistration/product-images');
var productGrade = require('./routes/basicregistration/product-grade');
var clientProducts = require('./routes/client/client-product');
var clientCar = require('./routes/client/client-car');

var request = require('./routes/consult/request');

var cadastro = require('./routes/cadastro');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, uploadDir: './temporary/files' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('uploadDir', './temporary/files');

app.use('/', routes);
app.use('/cadastro', cadastro);
app.use('/temporary/files/', temporaryFiles);
app.use('/basicregistration/users', users);
app.use('/basicregistration/clients', clients);
app.use('/basicregistration/clients/address', clientAddress);
app.use('/basicregistration/grades', grades);
app.use('/basicregistration/form-payments', formPayments);
app.use('/basicregistration/categorys', categorys);
app.use('/basicregistration/products', products);
app.use('/basicregistration/products/images', productImages);
app.use('/basicregistration/grades/products', productGrade);

app.use('/client/products', clientProducts);
app.use('/client/car', clientCar);

app.use('/consult/request', request);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}   

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        type: 'danger'
    });    
});

app.set('port', process.env.PORT || 80);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
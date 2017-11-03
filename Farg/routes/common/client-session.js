'use strict';
var Product = require('../../model/productModel');

function ClientSession(req) {   
    this.Req = req;
}

ClientSession.prototype = {
    initCar: function () {
        this.Req.session.loggeduser.car = {
            paymentForm: null,
            items: []
        }
    },

    addCarItem: function (item) {
        this.Req.session.loggeduser.car.items.push(item);
    },

    //Edita item no carrinho
    editCarItem: function (parans) {
        var carItemCol = this.Req.session.loggeduser.car.items.filter(function (el) {
            return el.productCode !== parans.productCode;
        });

        carItemCol.push(parans);
        this.Req.session.loggeduser.car.items = carItemCol;
    },

    removeCarItem: function (item) {
        var carItem = this.Req.session.loggeduser.car.items.filter(function (el) {
            return el.productCode !== item.code;
        });

        this.Req.session.loggeduser.car.items = carItem;
    },

    getCarItem: function (code) {
        if (this.Req.session.loggeduser.car) {
            var filter = this.Req.session.loggeduser.car.items.filter(function (el) {
                return el.productCode === code;
            });

            return filter.length > 0 ? filter[0] : null;
        } else {
            return null;
        }
    },

    getCarItemList: function () {
        return this.Req.session.loggeduser.car.items;
    },

    getPaymentFormSelected: function () {
        return this.Req.session.loggeduser.car.paymentForm;
    },

    existsItemSession: function (code) {
        if (this.Req.session.loggeduser.car) {
            var filter = this.Req.session.loggeduser.car.items.filter(function (el) {
                return el.productCode === code;
            });

            return filter.length > 0;
        } else {
            return false;
        }
    },
    //**Limpa items do carrinho
    clearCarItems: function () {
        this.Req.session.loggeduser.car.items = [];
    },

    calculateItemToCar: function (next) {
        var parans = {
            gradeCode: this.Req.body.product.gradeCode,
            quantity: this.Req.body.product.quantity,
            paymentFormCode: this.Req.body.product.paymentFormCode
        };

        var gradeCode = this.Req.body.product.gradeCode;
        var quantity = this.Req.body.product.quantity;
        var paymentFormCode = this.Req.body.product.paymentFormCode;

        if (!gradeCode || !quantity || !paymentFormCode)
            next(null, {
                message: 'Parâmetros para adição do item não informados',
                type: 'danger'
            }, this);
        else {
            var product = new Product();

            product.getParansProduct({
                code: this.Req.body.product.code,
                icmsCode: this.Req.session.loggeduser.icmsCode,
                clientCode: this.Req.session.loggeduser.clientCode,
                gradeCode: gradeCode,
                paymentFormCode: paymentFormCode
            }).then(function (parans) {

                if (parans.length > 0) {
                    var item = parans[0];
                    var discountGrade = item.productValue * item.discountGrade;
                    var discountPaymentForm = item.productValue * item.discountPaymentForm;
                    var discountClient = item.productValue * item.discountClient;

                    //Valor final para unidade do produto
                    var unitFinalValue = item.productValue - discountClient - discountGrade - discountPaymentForm;

                    next({
                        productCode: this.Req.body.product.code,
                        gradeCode: gradeCode,
                        quantity: quantity,
                        unitValue: unitFinalValue,
                        paymentForm: paymentFormCode
                    }, null, this);

                } else {
                    next(null, {
                        message: 'Informações do produto não encontradas',
                        type: 'danger'
                    },
                    this);
                }
            });
        }
    }
};

module.exports = ClientSession;
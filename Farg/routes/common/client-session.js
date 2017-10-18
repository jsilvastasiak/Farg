'use strict';
var Product = require('../../model/productModel');

function ClientSession(req) {   
    this.Req = req;
}

ClientSession.prototype = {
        
    addCarItem: function (item) {
        if (!this.Req.session.loggeduser.car.paymentForm)
            this.Req.session.loggeduser.car.paymentForm = item.paymentForm;

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

    existsItemSession: function (code) {
        if (this.Req.session.loggeduser.car) {
            var filter = this.Req.session.loggeduser.car.items.filter(function (el) {
                return el.productCode === code;
            });

            return filter.length > 0;
        } else {
            return false;
        }
    }
};

module.exports = ClientSession;
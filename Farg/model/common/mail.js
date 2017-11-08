'use strict';
var nodemailer = require('nodemailer');
var Parameters = require('../parametersModel');

function Mail(req) {  

    this.options = {
        from: null,
        to: null,
        subject: null,
        text: null,
        html: null
    };

    this.req = req;
};

Mail.prototype = {

    sendMail: function (mailOptions, next) {

        var parameters = new Parameters();
        parameters.getByCode(this.req.session.loggeduser).then(function (result) {
            if (result) {
                //Cria transporter com informações do banco
                var transp = nodemailer.createTransport({
                    host: result.dataValues.nom_host_email,
                    port: result.dataValues.nro_port_email,
                    secure: false,
                    auth: {
                        user: result.dataValues.nom_usuario_email,
                        pass: result.dataValues.snh_usuario_email
                    }
                });

                //manda email
                transp.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                        return next(null, err);
                    }

                    console.log('Mensagem enviada: %s', info.messageId);
                    console.log('URL: %s', nodemailer.getTestMessageUrl(info));

                    return next(info, null);
                });
            }
        });
    }
};

module.exports = Mail;
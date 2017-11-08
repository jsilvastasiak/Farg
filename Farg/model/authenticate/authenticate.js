var User = require('../userModel');

var isValidPassword = function (password, comparepass) {
    return password === comparepass;
};

/**
 * Cria sessão para usuário autenticado
 * @param user
 */
var setUserSession = function (req, user) {
    
    req.session.loggeduser = {
        userCode: user.codigo,
        isAdmin: user.isAdmin === 'S',
        isAgent: user.isAgente === 'S',
        isClient: user.isClient === 'S',
        clientCode: user.clientCode,
        clientName: user.clientName,
        clientMail: user.clientEmail,
        icmsCode: user.icmsCode,
        companyCode: 1, // Código da empresa e filial, ainda não implementado
        subsidiaryCode: 1,
        car: {
            paymentForm: null,
            items: []
        }
    };
}

module.exports = {
    
    authenticate: function (req, username, password, done) {
        var thisUser = new User();
        
        thisUser.getByLogin(username.toUpperCase()).then(function (findedUser) {
            
            if (findedUser.length == 0) {
                console.log('Usuário não encontrado');
                return done(req, false, 'Usuário não encontrado.');
            }

            if (!isValidPassword(findedUser[0].senha, password)) {
                console.log('Senha Inválida');
                return done(req, false, 'Senha Inválida');
            }

            setUserSession(req, findedUser[0]);

            return done(req, true, 'Usuário logado');
        });
    },
    /*Verificação se usuário está autenticado*/
    isAuthenticated: function (req, res, next) {
        if (req.session.loggeduser)
            return next();
        res.redirect('/login');
    },

    logout: function (req, done) {
        req.session.loggeduser = null;

        done();
    }
}
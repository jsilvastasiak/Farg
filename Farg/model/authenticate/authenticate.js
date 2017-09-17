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
        isAgent: user.isAgent === 'S',
        isClient: user.isClient === 'S'
    };
}

module.exports = {
    
    authenticate: function (req, username, password, done) {
        var thisUser = new User();

        console.log('Passou aqui.');

        thisUser.getByLogin(username.toUpperCase()).then(function (findedUser) {
            
            if (findedUser.length == 0) {
                console.log('Usuário não encontrado');
                return done(req, false, req.flash('message', 'Usuário não encontrado.'));
            }

            if (!isValidPassword(findedUser[0].senha, password)) {
                console.log('Senha Inválida');
                return done(req, false, req.flash('message', 'Senha Inválida'));
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
    }
}
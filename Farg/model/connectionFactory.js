var pg = require('pg');
var Sequelize = require('sequelize');
//var connection = new Sequelize('postgres://farg:.Farg635241@factoring.postgres.uhserver.com:5432/factoring');
var connection = new Sequelize('postgres://postgres:1234@localhost:1234/Farg');

connection.authenticate().then(function () {
    console.log('Conexão estabelecida com sucesso.');
}).catch(function (err) {
    console.error('Erro ao conectar base', err);
});

//connection.query("SET datestyle TO SQL, MDY");

//var conString = "postgres://postgres:1234@localhost:1234/Farg";
module.exports = connection;

//module.exports.conectar = function () {
//    client = new pg.Client(conString);

//    client.connect(function (err) {
//        if (err) {
//            console.error('Erro ao conectar com banco', err);
//        }
//    });        
    
//    return client;
//};

//module.exports.terminar = function () {
//    client.end(function (err) {
//        if (err) {
//            console.error('Erro ao fechar conexão com banco', err);
//        }
//    });   
//};
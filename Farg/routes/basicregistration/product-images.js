'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var ImageProduct = require('../../model/productImageModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');
var path = require('path');
var fs = require('fs');

var router = express.Router();

router.get('/getImagesList', auth.isAuthenticated, function (req, res) {

    var imageProduct = new ImageProduct();
    var paransQuery = paransBuilder.createParansModel(req.query);

    imageProduct.getImageProducts(paransQuery).then(function (imageProductList) {
        var result = {};
        if (imageProductList) {
            result = paransBuilder.createParansResponse(imageProductList, req);
        }

        res.send(result);
        res.end();
    }).catch(function (err) {
        console.log(err.message);
        res.send({ message: err.message, type: 'danger' });
        res.end();
    });
});

router.get('/getImageData', auth.isAuthenticated, function (req, res) {

    var imageProduct = new ImageProduct();

    if (req.query.image) {
        var paransQuery = JSON.parse(req.query.image);

        imageProduct.getByCode(paransQuery).then(function (imageProduct) {
            if (imageProduct) {
                res.send({ filename: imageProduct.dsc_caminho });
            } else {
                res.send({
                    message: 'Imagem não encontrada.',
                    type: 'danger'
                });
            }
            res.end();
        });
    } else {
        res.send({
            message: 'Parâmetros image não passados.',
            type: 'danger'
        });
        res.end();
    }
});

router.get('/getImageStatusOptions', auth.isAuthenticated, function (req, res) {

    var refCodes = new RefCodes();

    refCodes.getValuesByDomain("ACTIVE_INACTIVE").then(function (domainValues) {
        res.send(domainValues);
        res.end();
    }).catch(function (err) {
        res.send({
            message: 'Erro ao selecionar ImageTypeOptions ' + err.message,
            type: 'danger'
        });
        res.end();
        console.log(err);
    });
});

router.post('/updateImage', auth.isAuthenticated, function (req, res) {

    var imageProduct = new ImageProduct();
    var relativePath = null;

    if (req.body.image.fileName && req.body.image.fileName !== "") {
        relativePath = '/images/product-images/' + req.body.image.fileName;
        var filePath = path.join(path.resolve('temporary/files'), '/', req.body.image.fileName);
        var pathDestiny = path.join(path.resolve('public/images/product-images/'), req.body.image.fileName);
        var readableStream = fs.createReadStream(filePath);
        var writableStream = fs.createWriteStream(pathDestiny);

        readableStream.pipe(writableStream);
    }

    imageProduct.getByCode(req.body.image).then(function (imageProduct) {
        //É necessário deletar se houver uma atualização do arquivo
        if (relativePath) {
            deleteFile(imageProduct.dsc_caminho);
        }

        imageProduct.updateAttributes({
            dsc_imagem: req.body.image.imageDescription,
            dsc_caminho: relativePath !== null ? relativePath : imageProduct.dsc_caminho,
            idc_ativo: req.body.image.idcActive
        }).then(function () {
            res.send(paransBuilder.updateMessageToResponse());
        }).catch(function (err) {
            res.send(paransBuilder.updateMessageToResponse(err));
            console.log(err);
        });
    });
});

router.post('/insertImage', auth.isAuthenticated, function (req, res) {

    var imageProduct = new ImageProduct();

    if (req.body.image.fileName && req.body.image.fileName !== "") {
        var relativePath = '/images/product-images/' + req.body.image.fileName;
        var filePath = path.join(path.resolve('temporary/files'), '/', req.body.image.fileName);
        var pathDestiny = path.join(path.resolve('public/images/product-images/'), req.body.image.fileName);
        var readableStream = fs.createReadStream(filePath);
        var writableStream = fs.createWriteStream(pathDestiny);

        readableStream.pipe(writableStream);
        
        imageProduct.getDefinition().then(function (imageProduct) {
            imageProduct.max('cdg_imagem', {
                where: {
                    cdg_produto: req.body.image.productCode
                }
            }).then(max => {
                imageProduct.create({
                    cdg_produto: req.body.image.productCode,
                    cdg_imagem: (max ? max : 0) + 1,
                    dsc_imagem: req.body.image.imageDescription,
                    dsc_caminho: relativePath,
                    idc_ativo: req.body.image.idcActive
                }).then(function () {
                    res.send(paransBuilder.insertMessageToResponse());
                    res.end();

                }).catch(function (err) {
                    res.send(paransBuilder.insertMessageToResponse(err));
                    console.log(err);
                });
            });
        });
    } else {
        res.send(paransBuilder.insertMessageToResponse({ message: 'Nenhum arquivo de imagem encontrado.' }));
        res.end();
    }
});

router.post('/deleteImage', auth.isAuthenticated, function (req, res) {

    var imageProduct = new ImageProduct();
    imageProduct.getByCode(req.body.image).then(function (image) {
        deleteFile(image.dsc_caminho);
    });

    imageProduct.getDefinition().then(function (imageProduct) {
        imageProduct.destroy({
            returning: true,
            where: {
                cdg_produto: req.body.image.productCode,
                cdg_imagem: req.body.image.imageCode
            }
        }).then(function (instance) {
            res.send(paransBuilder.deleteMessageToResponse(instance));
            res.end();
        }).catch(function (err) {
            res.send(paransBuilder.deleteMessageToResponse(instance, err));
            console.log(err);
        });
    });
});

module.exports = router;

var deleteFile = function (pathRelativeToDelete) {
    var pathToDelete = path.join(path.resolve('public/'), pathRelativeToDelete);
    fs.unlink(pathToDelete, function (err) {
        if (err) {
            console.error('Não foi possível deletar o arquivo. ' + err.message);
        }
    })
};
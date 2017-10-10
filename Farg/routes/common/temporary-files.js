'use strict';
var express = require('express');
var auth = require('../../model/authenticate/authenticate');
var Category = require('../../model/categoryModel');
var paransBuilder = require('../common/paransBuilder');
var RefCodes = require('../../model/refcodesModel');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var router = express.Router();

router.post('/', auth.isAuthenticated, function (req, res) {

    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.resolve('temporary/files');

    var newFileName = null;

    form.on('file', function (field, file) {
        
        newFileName = path.join(form.uploadDir, file.name);
        
        if (fs.existsSync(newFileName)) {
            var time = new Date();
            newFileName = newFileName.replace(path.extname(newFileName), "") + time.getTime() + path.extname(newFileName);
        }

        fs.rename(file.path, newFileName);
    });

    form.on('end', function () {
        res.send({
            message: 'upload success',
            filename: path.basename(newFileName)
        });
        res.end();
    });

    form.parse(req);
});

module.exports = router;
'use strict'

var express=require('express');
var PersonaController = require('../controllers/personaController');

var api= express.Router();


const path = require('path');
const fileUpload = require('express-fileupload');
api.use(fileUpload());

//var md_auth=require('../../middlewares/authenticated');

//var multipart = require('connect-multiparty');
//var md_upload= multipart({uploadDir:'./public'});

api.post('/registro', PersonaController.saveUser);
api.post('/informacion',PersonaController.login);
api.post('/subir_foto',PersonaController.subirFoto);

api.get('/inicio', function(req, res) {
    res.render('html/login');
});

api.get('/',function(req, res) {
    res.render('html/registro');
});
api.get('/pdf',PersonaController.generarPdf);


module.exports=api;
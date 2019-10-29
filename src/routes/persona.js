'use strict'

var express=require('express');
var PersonaController = require('../controllers/personaController');

var app= express.Router();


const path = require('path');
const fileUpload = require('express-fileupload');
app.use(fileUpload());


app.post('/registro', PersonaController.saveUser);
app.post('/informacion',PersonaController.login);
app.post('/subirfoto',PersonaController.subirFoto);


///rutas de registro y logueo
app.get('/inicio', function(req, res) {
    res.render('html/login');
});

app.get('/',function(req, res) {
    res.render('html/registro');
});

app.get('/pdf',PersonaController.generarPdf);


module.exports=app;
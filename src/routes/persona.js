'use strict'

var express=require('express');
var PersonaController = require('../controllers/personaController');

var app= express.Router();


const fileUpload = require('express-fileupload');
app.use(fileUpload());



app.post('/registro', PersonaController.saveUser);
app.post('/informacion',PersonaController.login);
app.post('/subir_foto',PersonaController.subirFoto);
app.post('/edubasica',PersonaController.addeduBasica);
app.post('/edusuperior',PersonaController.addeduSuperior);

app.post('/experiencia',PersonaController.addexperiecia);
app.post('/recomendacion',PersonaController.addrecomendacion);

app.post('/pdf',PersonaController.generarPdf)

///rutas de registro y logueo
app.get('/inicio', function(req, res) {
    res.render('html/login');
});

app.get('/',function(req, res) {
    res.render('html/registro');
});


app.get('/pdf',PersonaController.generarPdf);


module.exports=app;
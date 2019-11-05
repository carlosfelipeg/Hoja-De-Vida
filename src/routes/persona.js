'use strict'

var express=require('express');
var PersonaController = require('../controllers/personaController');

var app= express.Router();

var md_auth=require('../middlewares/authenticated');
const fileUpload = require('express-fileupload');
app.use(fileUpload());



app.post('/registro', PersonaController.saveUser);
app.post('/informacion',PersonaController.login);
app.post('/subir_foto',PersonaController.subirFoto);
app.post('/agregaredubasica',PersonaController.addEduBasica);
app.post('/agregaredusuperior',PersonaController.addEduSuperior);
app.post('/agregarexperiencia',PersonaController.addExperiecia);
app.post('/agregarrecomendacion',PersonaController.addReferencia);
app.post('/descripcion',PersonaController.addDescripcion);
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
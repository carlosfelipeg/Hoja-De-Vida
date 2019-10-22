'use strict'

var express=require('express');
var PersonaController = require('../controllers/personaController');

var api= express.Router();
const path = require('path');
//var md_auth=require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload= multipart({uploadDir:'./public'});

api.post('/registro', PersonaController.saveUser);
api.post('/login',PersonaController.login);

api.get('/inicio', function(req, res) {
    res.render('html/login');
});

api.get('/',function(req, res) {
    res.render('html/registro');
});


module.exports=api;
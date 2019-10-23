'use strict'
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mysql= require('mysql');
const myConnection = require('express-myconnection');

const app = express();
//importing routes
const personaRoutes=require('./routes/persona');


// settings
app.set('port', process.env.PORT||3000);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname + '/views'));

//middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql,{
    host: 'localhost',
    user:'root',
    password:'12345678',
    port: '3306',
    database: 'hojadevida'
},'single'));
app.use(express.urlencoded({extended:false}));


//routes 
app.use('/',personaRoutes);

//static files
app.use(express(path.join(__dirname,'public')));

// starting the server
app.listen(app.get('port'),()=>{
   console.log('Server on port'+app.get('port') );
});
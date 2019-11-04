'use strict'
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mysql= require('mysql');
const myConnection = require('express-myconnection');
const session = require('express-session')

const app = express();
//importar rutas
const personaRoutes=require('./routes/persona');


// configuraciones
app.set('port', process.env.PORT||3000);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname + '/views'));

//middlewares
app.use(morgan('dev'));

//coneccion a bd
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

//session middleware
var sess = {
  secret: 'hoja-de-vida',
  resave:true,
  saveUninitialized:true,
  cookie: {}
}
 
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
 
app.use(session(sess));

//static files
app.use(express(path.join(__dirname,'public')));

// starting the server
app.listen(app.get('port'),()=>{
   console.log('Server on port'+app.get('port') );
});
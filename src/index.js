'use strict'
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const personaRoutes = require('./routes/persona');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
//session middleware

const sess = {
    secret: 'hoja-de-vida',
    cookie: {}
}

console.log(sess);
app.use(cookieParser());


if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));
// configuraciones
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/views'));

//middlewares
app.use(morgan('dev'));

//coneccion a bd
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    port: '3306',
    database: 'hojadevida'
}, 'single'));
app.use(express.urlencoded({ extended: false }));


//routes
app.use('/', personaRoutes);


//static files
app.use(express(path.join(__dirname, 'public')));
// starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port' + app.get('port'));
});
'use strict'

var bcrypt = require('bcryptjs');
var fs = require('fs');

//var pdf = require('html-pdf')

var ejs = require('ejs');
var wkhtmltopdf = require('wkhtmltopdf');

var path = require('path');
var jwt = require('../../services/jwt');
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function enviarMail(email, nombre, apellido) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "hojadevidaonlineufps@gmail.com",
            pass: "Fcbarcelona12345!"
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '<hojadevidaonlineufps@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Bienvenido ✔ ' + nombre + ' ' + apellido, // Subject line
        html: '<b>Bienvenido a Tu Hoja de Vida online, para comenzar Inicia sesion</b>' // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

enviarMail().catch(console.error);


function subirFoto(req, res) {
    
    console.log(req.body);

    if (req.files) {
        var file_name = req.files.file.name;
        console.log('hola ' + file_name);
        console.log(req.body);
        var ext_split = file_name.split('\.');
        console.log(ext_split);
        var file_ext = ext_split[1];
        console.log(file_ext);


        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            let EDFile = req.files.file;
            EDFile.mv(`./src/public/files/${EDFile.name}`, err => {
                if (err) return res.status(500).send({ message: err });
                req.getConnection((err, conn) => {
                    conn.query('UPDATE persona SET imagen WHERE documento = ?',[{ imagen: name }, userId], (err, imagenUpdate) => {
                        if (!persona) {
                            return res.status(200).render('html/registro', {
                                message: ''
                            });
                        }else{
                        return res.status(200).render('html/login', {
                            message: ''
                        });
                    }
                    });
                });
               
            });
        } else {
            return removeFiles(res, file_path, 'Extension no valida');
        }
    } else {
        return res.status(200).send({ message: 'No se ha subido una imagen' });
    }
}

function saveUser(req, res) {
    // variable params que me recibe el body de la solicitud
    var params = req.body;
    console.log(params);

    //creo el usuario que voy a guardar
    var user = new Object();

    //compruebo que existan todos los parametros
    if (params.documento && params.nombre && params.apellido && params.email && params.password&&params.fecha_nacimiento) {
        
        //compruebo que no exista un usuario en la BD con el mismo email 
        req.getConnection((err, conn) => {
        var sql = 'SELECT * FROM persona WHERE email = ?';
        conn.query(sql, [String(user.email)], (err, user) => {
            if (user.length >= 1) {
                return res.status(200).render('html/registro', {
                    message: 'Email ya existe, intenta ingresando otro E-mail',
                });
            }
            console.log(err);
        });
    });


        user.documento = params.documento;
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.email = params.email;
        user.fecha_nacimiento = params.fecha_nacimiento;

        //Crifro la password  
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(String(params.password), salt, function (err, hash) {
                user.password = hash;
                req.getConnection((err, conn) => {
                    
                    conn.query('INSERT INTO persona set ?', [user], (err, persona) => {
                        console.log(persona);
                        if (!persona) {
                            return res.status(200).render('html/registro', {
                                message: 'Documento ya existe'
                            });
                        }

                       //activar para enviar email// enviarMail(user.email, user.nombre, user.apellido);
                             return res.status(200).render('html/login', {
                            message: 'Registrado Correctamente'
                        });
                    });
                });
            });
        });
    } else {
        return res.status(200).render('html/registro', {
            message: 'Debes completar todos los campos'
        });
    }
}


function generarPdf(req, res) {

    try {
        console.log('hola');
        var base = path.resolve('.');
        var file = base + '/src/pdf/pdf.ejs';

        var template = fs.readFileSync(file, 'utf-8');
        var html = ejs.render(template, {});
        console.log(html);

    } catch (e) {
        console.log(e)  // If any error is thrown, you can see the message.
    }

    wkhtmltopdf(html).pipe(res);
    /*
    var options = {
        filename: './hojadevida.pdf', format: 'A4', orientation: 'portrait', directory: './phantomScripts/', type: "pdf"
    };
    pdf.create(html, options).toFile(function (err, res) {
        if (err) return console.log(err);
        console.log(res);
    });
    */
}

function login(req, res) {
    var params = req.body;

    var documento = params.documento;
    var password = params.password;

    req.getConnection((err, conn) => {
        var sql = 'SELECT * FROM persona WHERE documento = ?';
        conn.query(sql, [String(documento)], (err, users) => {
            if (users.length == 0) {
                return res.status(200).render('html/login', {
                    message: 'Documento No Registrado'
                });
            }
            bcrypt.compare(password, users[0].password, (err, check) => {//comparo la del POST con la encriptada
                
                if (check) {
                    users[0].password = undefined;//elimino la contraseña de los datos que retorno
                    console.log("f");
                    console.log(users[0]);
                    return res.status(200).render('html/index', {
                            user: users[0],
                        });
                }else{
                    return res.status(200).render('html/login', {
                        message: 'Documento o Contraseña Incorrecta',
                    });
                }
            });
        });
    });
}
module.exports = {
    saveUser,
    login,
    subirFoto,
    generarPdf
}

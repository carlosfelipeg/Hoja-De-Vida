'use strict'

var bcrypt = require('bcryptjs');
var fs = require('fs');

var jwt = require('../services/jwt');

//var pdf = require('html-pdf')

var ejs = require('ejs');
var pdf = require('html-pdf');

var path = require('path');

const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function enviarMail(email, nombre, apellido) {

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



    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

}

enviarMail().catch(console.error);


function subirFoto(req, res) {

    console.log(req.body);

    if (req.files) {
        var file_name = req.files.file.name;
        //console.log(file_name);
       // console.log(req.body);
        var ext_split = file_name.split('\.');
        //console.log(ext_split);
        var file_ext = ext_split[1];
        //console.log(file_ext);


        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            // guardo la imagen en EDFile
            let EDFile = req.files.file;
            //console.log(EDFile);
            console.log('cookie');
            console.log('documento');
            var documento=req.session.user.documento;
            console.log(documento);
            console.log('imagen');
            console.log(EDFile.name);
            EDFile.mv(`./src/views/imagen/${documento+'.png'}`, err => {
                if (err) return res.status(500).send({ message: err });
                req.getConnection((err, conn) => {
                    conn.query('UPDATE persona SET ? WHERE documento = ?', [{ imagen: documento+'.png' }, req.session.user.documento], (err, imagenUpdate) => {
                        var newUser= req.session.user;
                        newUser.imagen=documento+'.png';
                        if (!imagenUpdate) {
                            return res.status(200).render('html/index', {
                                message: 'Ha ocurrido un error',
                                user: newUser
                            });
                        } else {
                            return res.status(200).render('html/index', {
                                message: 'Actualizada correctamente',
                                user: newUser
                            });
                        }
                    });
                });

            });
        } else {
            return res.status(200).render('html/index', {
                message: 'Archivo no es una imagen',
                user: req.session.user
            });
        }
    } else {
        return res.status(200).send({ message: 'No se ha subido una imagen' });
    }
}

function saveUser(req, res) {
    // variable params que me recibe el body de la solicitud
    var params = req.body;
    //console.log("parametros");
    console.log(params);

    //creo el usuario que voy a guardar
    var user = new Object();

    //compruebo que existan todos los parametros
    if (params.documento && params.nombre && params.apellido && params.email && params.telefono && params.direccion && params.password && params.fecha_nacimiento) {

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

        //console.log("parametros :"+params);
        user.documento = params.documento;
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.email = params.email;
        user.fecha_nacimiento = params.fecha_nacimiento;
        user.telefono = params.telefono;
        user.direccion = params.direccion;
        user.imagen = 'perfil.png'
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(String(params.password), salt, function (err, hash) {
                user.password = hash;
                req.getConnection((err, conn) => {

                    conn.query('INSERT INTO persona set ?', [user], (err, persona) => {
                        //console.log("guardo")
                        //console.log(persona);
                        if (!persona) {
                            return res.status(200).render('html/registro', {
                                message: 'Documento ya existe'
                            });
                        }

                        enviarMail(user.email, user.nombre, user.apellido);
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


function addEduBasica(req, res) {
    var params = req.body;
    //console.log("parametros");
    console.log(params);
    var eduBasica = new Object();
    if (params.institucion && params.anio && params.pais) {
      //  eduBasica.documento = req.session.user.documento;
        eduBasica.pais_origen=params.pais;
        eduBasica.nombre_institucion=params.institucion;
        eduBasica.anio_grado=params.anio;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO formacion_academica set ?', [eduBasica], (err, newEduBasica) => {
                if (!newEduBasica) {
                    console.log('no add');
                    return res.status(200).render('html/index', {
                        message: 'Error al Agregar',
                        user: req.session.user
                    });
                } else {
                    return res.status(200).render('html/index', {
                        message: 'Agregada Correctamente',
                        user: req.session.user
                    });
                }
            });
        });
    } else {
        return res.status(200).render('html/index', {
            message: 'Debes completar todos los campos'
        });
    }
}

function addEduSuperior(req, res) {

}
function addExperiecia(req, res) {

}
function addReferencia(req, res) {

}
function getEdubasica(req, res) {

}

function generarPdf(req, res) {

    try {
        var base = path.resolve('.');
        var file = base + '/src/pdf/pdf.ejs';

        var template = fs.readFileSync(file, 'utf-8');
        var data = req.body;
        var html = ejs.render(template, req.body);
        console.log(html);

    } catch (e) {
        console.log(e)
    }

    var options = { format: 'Letter' };

    pdf.create(html).toFile('./salida.pdf', function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
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
                    users[0].password = undefined;
                    const token = jwt.createToken(users[0]);

                    // en caso de que la app requiera uso de tokens
                    if (params.gettoken) {
                        //generar y devolver token
                        return res.status(200).header('Authorization', token).send({
                            token: jwt.createToken(users[0])
                        });
                    }
                    console.log(users[0].fecha_nacimiento);

                    req.session.user = users[0] ;
                    console.log('session');
                    console.log(req.session.user);
                    return res.status(200).render('html/index', {
                        user: req.session.user,
                    });
                } else {
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
    generarPdf,
    addEduBasica,
    addEduSuperior,
    addExperiecia,
    addReferencia,
    addEduSuperior,
    addExperiecia


}

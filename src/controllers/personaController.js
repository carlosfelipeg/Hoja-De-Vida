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

    //console.log('Message sent: %s', info.messageId);



    //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

}

enviarMail().catch();

function reload(req,res,message,error){
    return res.status(200).render('html/index', {
        user: req.session.user,
        educacion: req.session.educacionBasica,
        educacionSuperior: req.session.educacionSuperior,
        message:message,
        error:error
    });
}

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
            // console.log('cookie');
            // console.log('documento');
            var documento = req.session.user.documento;
            //console.log(documento);
            //console.log('imagen');
            // console.log(EDFile.name);
            EDFile.mv(`./src/views/imagen/${documento + '.png'}`, err => {
                if (err) return res.status(500).send({ message: err });
                req.getConnection((err, conn) => {
                    conn.query('UPDATE persona SET ? WHERE documento = ?', [{ imagen: documento + '.png' }, req.session.user.documento], (err, imagenUpdate) => {
                       req.session.user.imagen = documento + '.png';
                        if (!imagenUpdate) {
                            return reload(req,res,'Ha ocurrido un error', true);
                            return res.status(200).render('html/index', {
                                message: 'Ha ocurrido un error',
                                user: req.session.user,
                                error: true
                            });
                        } else {
                            return reload(req,res,'Actualizada Correctamente', false);
                            return res.status(200).render('html/index', {
                                message: 'Actualizada correctamente',
                                user: req.session.user,
                                error: false
                            });
                        }
                    });
                });

            });
        } else {
            return reload(req,res,'Archivo no es una imagen', true);
            return res.status(200).render('html/index', {
                message: 'Archivo no es una imagen',
                user: req.session.user,
                error: true
            });
        }
    } else {
        return res.status(200).send({
            message: 'No se ha subido una imagen',
            error: true

        });
    }
}

function saveUser(req, res) {
    // variable params que me recibe el body de la solicitud
    var params = req.body;
    console.log("parametros");
    console.log(params);

    //compruebo que existan todos los parametros
    if (params.documento && params.nombre && params.apellido && params.email && params.telefono && params.direccion && params.password && params.fecha_nacimiento) {

        //compruebo que no exista un usuario en la BD con el mismo email 
        req.getConnection((err, conn) => {
            var sql = 'SELECT * FROM persona WHERE email = ?';
            conn.query(sql, [String(params.email)], (err, userN) => {
                console.log(userN.length);
                if (userN.length >= 1) {
                    return res.status(200).render('html/registro', {
                        message: 'Email ya existe, intenta ingresando otro E-mail',
                        error: true
                    });
                }
                if (err) {
                    console.log(err);
                }
            });
        });

        //creo el usuario que voy a guardar
        var user = new Object();

        user.documento = params.documento;
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.email = params.email;
        user.estado_civil = params.estado_civil;
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
                                message: 'Documento ya existe',
                                error: true
                            });
                        }

                        enviarMail(user.email, user.nombre, user.apellido);
                        return res.status(200).render('html/login', {
                            message: 'Registrado Correctamente',
                            error: false
                        });
                    });
                });
            });
        });
    } else {
        return res.status(200).render('html/registro', {
            message: 'Debes completar todos los campos',
            error: true,
        });
    }
}


function addEduBasica(req, res) {
    var params = req.body;
    //console.log("parametros");
    //console.log(params);
    var eduBasica = new Object();
    if (params.institucion && params.anio && params.pais) {
        eduBasica.pais_origen = params.pais;
        eduBasica.nombre_institucion = params.institucion;
        eduBasica.anio_grado = params.anio;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO formacion_academica set ?', [eduBasica], (err, newEduBasica) => {
                var id = newEduBasica.insertId;
                if (!newEduBasica) {
                    return res.status(200).render('html/index', {
                        message: 'Error al Agregar',
                        user: req.session.user,
                        error: true
                    });
                } else {
                    var formacion_persona = new Object();
                    formacion_persona.documento_persona = req.session.user.documento;
                    formacion_persona.id_formacion = id;
                    conn.query('INSERT INTO formacion_persona set ?', [formacion_persona], (err, newformacion) => {
                        if (!newformacion) {
                            return res.status(200).render('html/index', {
                                message: 'Error al Agregar',
                                user: req.session.user,
                                error: true
                            });
                        } else {
                            return res.status(200).render('html/index', {
                                message: 'Agregada Correctamente',
                                user: req.session.user,
                                error: false
                            });
                        }
                    });
                    return res.status(200).render('html/index', {
                        message: 'Agregada Correctamente',
                        user: req.session.user,
                        error: false
                    });
                }
            });
        });
    } else {
        return res.status(200).render('html/index', {
            message: 'Debes completar todos los campos',
            user: req.session.user,
            error: true
        });
    }
}

function addEduSuperior(req, res) {
    var params = req.body;
    //console.log("parametros");
    //console.log(params);
    var userR = (req.session.user);
    var eduSuperior = new Object();
    if (params.superior_tarjeta && params.superior_anio && params.superior_estudio && params.superior_modalidad) {
        eduSuperior.num_tarjetaProfesional = parseInt(params.superior_tarjeta);
        eduSuperior.nombre_estudio = params.superior_estudio;
        eduSuperior.anio_finalizacion = parseInt(params.superior_anio);
        eduSuperior.modalidad = params.superior_modalidad;
        //console.log("edu agg");
        //console.log(eduSuperior);
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO educacion_superior set ?', [eduSuperior], (err, newEduSuperior) => {
                if (!newEduSuperior) {
                    return res.status(200).render('html/index', {
                        user: userR
                    });
                } else {
                    var pregrado_persona = new Object();
                    pregrado_persona.documento_persona = req.session.user.documento;
                    pregrado_persona.num_tarjeta = params.superior_tarjeta;
                    conn.query('INSERT INTO pregrado_persona set ?', [pregrado_persona], (err, newformacion) => {
                        if (!newformacion) {
                            return res.status(200).render('html/index', {
                                message: 'Error al Agregar',
                                user: userR,
                                error: true
                            });
                        } else {
                            return res.status(200).render('html/index', {
                                message: 'Agregada Correctamente',
                                user: userR,
                                error: false
                            });
                        }
                    });
                    return res.status(200).render('html/index', {
                        message: 'Agregada Correctamente',
                        user: req.session.user,
                        error: false
                    });
                }
            });
        });
    } else {
        return res.status(200).render('html/index', {
            message: 'Debes completar todos los campos',
            user: userR,
            error: true
        });
    }
}

function addExperiecia(req, res) {
    var params = req.body;
    //console.log("parametros");
    //console.log(params);
    var userR = (req.session.user);
    var experiencia = new Object();
    if (params.experiencia_empresa && params.experiencia_pais && params.experiencia_ciudad && params.experiencia_cargo) {
        experiencia.nombre_empresa = params.experiencia_empresa;
        experiencia.cargo_ocupado = params.experiencia_cargo;
        experiencia.fecha_inicio = params.fecha_ingreso;
        experiencia.fecha_fin = params.fecha_retiro;
        experiencia.pais = params.experiencia_pais;
        experiencia.ciudad = params.experiencia_ciudad;
        //console.log('exp');
        //console.log(experiencia);
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO experiencia_laboral set ?', [experiencia], (err, newExperiencia) => {
                console.log(newExperiencia);
                var id = newExperiencia.insertId;
                if (!newExperiencia) {
                    return res.status(200).render('html/index', {
                        message: 'Error al Agregar',
                        user: userR,
                        error: true
                    });
                } else {
                    var exp = new Object();
                    exp.documento_persona = req.session.user.documento;
                    exp.id_experiencia = id;
                    conn.query('INSERT INTO trabajos set ?', [exp], (err, newexp) => {
                        if (!newexp) {
                            return res.status(200).render('html/index', {
                                message: 'Error al Agregar',
                                user: userR,
                                error: true
                            });
                        } else {
                            return res.status(200).render('html/index', {
                                message: 'Agregada Correctamente',
                                user: userR,
                                error: false
                            });
                        }
                    });
                }
            });
        });
    } else {
        return res.status(200).render('html/index', {
            message: 'Debes completar todos los campos',
            user: userR
        });
    }
}

function addReferencia(req, res) {
    var params = req.body;
    console.log("parametros");
    console.log(params);
    var userR = (req.session.user);
    var referencia = new Object();
    if (params.referencia_nombre && params.referencia_documento && params.referencia_ocupacion && params.referencia_telefono) {
        referencia.documento = parseInt(params.referencia_documento);
        referencia.nombre = params.referencia_nombre;
        referencia.telefono = parseInt(params.referencia_telefono);
        referencia.cargo_ocupado = params.referencia_ocupacion;

        //console.log('ref');
        //console.log(referencia);
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO referencia set ?', [referencia], (err, newReferencia) => {
                // console.log(newReferencia);
                // var id=newExperiencia.insertId;
                if (!newReferencia) {
                    return res.status(200).render('html/index', {
                        message: 'Error al Agregar',
                        user: userR,
                        error: true
                    });
                } else {
                    var referencia_persona = new Object();
                    referencia_persona.documento_referido = req.session.user.documento;
                    referencia_persona.documento_referente = params.referencia_documento;
                    conn.query('INSERT INTO referencia_persona set ?', [referencia_persona], (err, newref) => {
                        if (!newref) {
                            return res.status(200).render('html/index', {
                                message: 'Error al Agregar',
                                user: userR,
                                error: true
                            });
                        } else {
                            return res.status(200).render('html/index', {
                                message: 'Agregada Correctamente',
                                user: userR,
                                error: false
                            });
                        }
                    });
                }
            });
        });
    } else {
        return res.status(200).render('html/index', {
            message: 'Debes completar todos los campos',
            user: userR,
            error: false
        });
    }
}
function getEdubasica(req, res, callback) {
    req.getConnection((err, conn) => {
        var sql = 'SELECT * FROM formacion_persona WHERE documento_persona = ?';
         conn.query(sql, [String(req.session.user.documento)], (err, eduBasica) => {
            if (eduBasica.length>0) {
                var sql = 'SELECT * FROM formacion_academica WHERE id_formacion = ?';
                 conn.query(sql, [String(eduBasica[0].id_formacion)], (err, educacion) => {
                    if (educacion) {
                        req.session.educacionBasica = educacion[0];
                        return callback();
                    }else{
                        return callback();
                    }
                });
            }
        });
    });
}

function getEduSuperior(req, res) {
    req.getConnection((err, conn) => {
        var sql = 'SELECT * FROM pregrado_persona WHERE documento_persona = ?';
         conn.query(sql, [String(req.session.user.documento)], (err, eduSuperior) => {
             var educacionSup = [];
            eduSuperior.forEach(element => {
                 var sql = 'SELECT * FROM educacion_superior WHERE num_tarjetaProfesional = ?';
                    conn.query(sql, [String(element.num_tarjeta)], (err, educacion) => {
                       if (educacion) {
                           educacionSup.push(educacion[0]);
                       }
                   }); 
             });
             
            req.session.educacionSuperior = educacionSup;
        });
    });
}

function addDescripcion(req, res) {
    //console.log('params descripcion');
    //console.log(req.body);
    req.getConnection((err, conn) => {
        conn.query('UPDATE persona SET ? WHERE documento = ?', [{ descripcion: req.body.descripcion }, req.session.user.documento], (err, descripcionUpdated) => {
           req.session.user.descripcion = req.body.descripcion;
            if (!descripcionUpdated) {
                return reload(req,res,'Ha Ocurrido un error', true);
                
            } else {
                return reload(req,res,'Actualizada Correctamente', false);
            }
        });
    });
}

function generarPdf(req, res) {

    try {
        var base = path.resolve('.');
        var file = base + '/src/views/html/pdf.ejs';

        var template = fs.readFileSync(file, 'utf-8');
        //console.log('SESSSS');
        //console.log(req.session);
        var html = ejs.render(template, req.session);
        // console.log(html);

    } catch (e) {
        console.log(e)
    }

    var options = { format: 'Letter' };

    res.status(200).render('html/pdf', {
        message: 'PDF Creado',
        user: req.session.user
    });

    pdf.create(html).toFile('./salida.pdf', function (err, res) {
        //console.log('DIRNAME');
        // console.log(__dirname);
        var file = __dirname + 'salida.pdf';
        //res.download(file); 
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
    return res.status(200).render('html/pdf', {
        message: 'PDF Creado',
        user: req.session.user
    });
}

function login(req, res) {
    var params = req.body;

    if (params.documento && params.password) {
        var documento = params.documento;
        var password = params.password;

        req.getConnection((err, conn) => {
            var sql = 'SELECT * FROM persona WHERE documento = ?';
            conn.query(sql, [String(documento)], (err, users) => {
                if (users.length == 0) {
                    return res.status(200).render('html/login', {
                        message: 'Documento No Registrado',
                        error: true
                    });
                }
                 bcrypt.compare(password, users[0].password, (err, check) => {//comparo la del POST con la encriptada

                    if (check) {
                        console.log('hola');
                        users[0].password = undefined;
                        //const token = jwt.createToken(users[0]);
                        // en caso de que la app requiera uso de tokens
                       // if (params.gettoken) {
                            //generar y devolver token
                         //   return res.status(200).header('Authorization', token).send({
                           //     token: jwt.createToken(users[0])
                           // });
                       // }

                        req.session.user = users[0];
                        //console.log('session');
                        //console.log(req.session.user);
                       
                        getEduSuperior(req, res);
                        return getEdubasica(req, res ,function(){
                            return reload(req,res);
                        });
                        
                    } else {
                        return res.status(200).render('html/login', {
                            message: 'Documento o Contraseña Incorrecta',
                            error: true
                        });
                    }
                });
            });
        });
    }else{
        return res.status(200).render('html/login', {
            message: 'Debes ingresar todos los campos',
            error: true
        });
    }
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
    addExperiecia,
    addDescripcion,
    getEdubasica,
    getEduSuperior


}

'use strict'
var bcrypt = require('bcryptjs');
var fs = require('fs');
var path = require('path');
var jwt=require('../../services/jwt');
function saveUser(req, res) {
    var params = req.body;
    console.log(params);
    //creo el usuario que voy a guardar
    var user = new Object();
    if (params.documento && params.nombre && params.apellido&& params.email && params.password ) {

        user.documento = params.documento;
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.email = params.email;

        //Crifro la password  
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(String(params.password), salt, function(err, hash) {
                user.password = hash;
                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO persona set ?', [user], (err, persona) => {
                        res.render('html/login');
                    });
                });
            });
        });
    }else{
        return inicio(req, res);
    }
}

function inicio(req,res){
    res.render('html/registro');
}

function iniciar(req,res){
    res.render('html/login',{
        hola:'prueba'
    });
}

function login(req, res) {
        var params=req.body;
      
        var documento=params.documento;
        var password=params.password;
    
        req.getConnection((err,conn)=>{
            var sql = 'SELECT * FROM persona WHERE documento = ?';
            conn.query(sql,[String(documento)],(err, user)=>{
                console.log(user[0].email);
                bcrypt.compare(password, user[0].password, (err, check)=>{//comparo la del POST con la encriptada
                    if(check){
                         user.password=undefined;//elimino la contraseña de los datos que retorno
                         //devolver datos de usuario
                         if(params.gettoken){
                              //generar y devolver token
                              return res.status(200).send({
                                  token: jwt.createToken(user)
                              });
        
                         }else{
                            return res.status(200).send({user});
                         }
                    }else{
                          res.status(404).send({message:'El usuario no se ha podido identificar'});
                    }
                  });
            });
        });
}
module.exports = {
    saveUser,
    login,
    inicio,
    iniciar
}

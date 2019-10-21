'use strict'

var jwt = require('jwt-simple');
var moment=require('moment');
var secret='pass_secret_hoja_de_vida';
exports.createToken = function(persona){
 var payload={
     sub: persona.documeto,
     nombre: persona.nombre,
     apellido: persona.apellido,
     email: persona.email,
     fecha_nacimiento:persona.fecha_nacimiento,
     direccion: persona.direccion,
     telefono: persona.telefono,
     estado_civil:persona.estado_civil,
     iat: moment().unix(),
     exp: moment().add(30, 'days').unix
 };
 return jwt.encode(payload, secret);
}
'use strict'
var jwt=require('jwt-simple');
var moment=require('moment');
var secret='pass_secret_hoja_de_vida';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    try{
    var payload = jwt.decode(token, secret);//decodifico el token
      if(payload.exp<=moment().unix()){
         return res.status(401).send({
             message :'El token ha expirado'
         });
      }
      
      }catch(ex){
        return res.status(404).send({
            message :'El token no es valido'
        });
    }
       req.user=payload;
       next();
}
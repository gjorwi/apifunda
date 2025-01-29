'use strict';
var multiFunct = require('../functions/exterFunct');//Audit llamaddo
var mongoose1 = require('../models/UserModel'),
Authy = mongoose1.model('Authys');


exports.logoutFunct = function(req,res){
    logoutFunctInt(req,res)
    .catch(e => {
        console.log('Problemas en el servidor ****: ' + e.message);
        var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Problemas Internos, Contacte con el departamento de informática, Controller:  logoutFunct'
        };
        res.json(respuesta);
    });
}

async function logoutFunctInt (req, res, next) {    
    if(req.body.acceso ){
        const { token } = req.body;
        refreshTokens = refreshTokens.filter(refreshToken => refreshToken != token);
        Authy.findOneAndUpdate({userId:req.body.acceso},{token:""},{new:true}, async function (err, authyr) {
            if(err){
                console.log("ENtro en el IF")
                // var authy=await newAuthy.save();
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Error inesperado',
                    respuesta:err
                };
                return res.json(respuesta);
            }else{
                console.log("ENtro en el ELSE")
                // console.log(authyr)
                // console.log(accessToken)
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Su sesión ha cerrado con éxito!'
                };
                res.json(respuesta);
            }
        });
    }else{
        var respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Faltan datos requeridos'
        };
        res.json(respuesta);
    }
};

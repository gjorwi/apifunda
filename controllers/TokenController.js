'use strict';
var mongoose1 = require('../models/UserModel'),
Authy = mongoose1.model('Authys');
var multiFunct = require('../functions/exterFunct');//Audit llamaddo
const accessTokenSecret = 'fundasistem';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
const jwt = require('jsonwebtoken');

exports.refreshToken = function(req,res){
    refreshTokenInt(req,res)
    .catch(e => {
        console.log('Problemas en el servidor ****: ' + e.message);
        var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Problemas Internos, Contacte con el departamento de informatica'
        };
        res.json(respuesta);
    });
}

async function refreshTokenInt (req, res, next) {
    if(req.body.acceso ){
        const { token } = req.body;

        if (!token) {
            var respuesta = {
                error: true,
                codigo: 502,
                mensaje: 'Faltan datos requeridos'
            };
            return res.json(respuesta);
        }
        console.log("ARRAY EN FUNCION REFRESH : "+JSON.stringify(refreshTokens))
        if (!refreshTokens.includes(token)) {
            var respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'Token invalido'
            };
            
            return res.json(respuesta);
        }

        jwt.verify(token, refreshTokenSecret, (err, user) => {
            if (err) {
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Token Invalido'
                };
                
                return res.json(respuesta);
            }

            const accessToken = jwt.sign({ username: user.username, clave: user.clave }, accessTokenSecret, { expiresIn: '30m' });
            Authy.findOneAndUpdate({userId:req.body.acceso},{token:accessToken},{new:true}, async function (err, authyr) {
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
                        mensaje: 'Tiempo de token extendio',
                        respuesta:accessToken
                    };   
                    return res.json(respuesta);
                }
            });
        });
    }else{
        var respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Faltan datos requeridos'
        };
        res.json(respuesta);
    }
    //////////////////////
};
exports.checkToken = function(req,res){
    checkTokenInt(req,res)
    .catch(e => {
        console.log('Problemas en el servidor ****: ' + e.message);
        var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Problemas Internos, Contacte con el departamento de informatica checkToken'
        };
        res.json(respuesta);
    });
}

async function checkTokenInt (req, res, next) {
    const authHeader = req.headers.authorization;
    if(req.body.userId && authHeader){
        const token = authHeader.split(' ')[1];
        var checkTok =await Authy.findOne({userId:req.body.userId});
        if (checkTok!=null) {
            if(checkTok.token==token){
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Chequeo de token exitoso'
                };
                res.json(respuesta);
            }else{
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Error al chequear token'
                };
                res.json(respuesta);
            }
        } else {
            var respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'Error al chequear token 2'
            };
            res.json(respuesta);
        }
    }else{
        var respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Faltan datos requeridos'
        };
        res.json(respuesta);
    }
    //////////////////////
};

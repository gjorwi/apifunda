'use strict';
var mongoose1 = require('../models/UserModel'),
User = mongoose1.model('Users');
var mongoose2 = require('../models/PerdatModel'),
Perdat = mongoose2.model('Perdats');
var multiFunct = require('../functions/exterFunct');//Audit llamaddo


exports.loginFunct = function(req,res){
    loginInt(req,res)
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

async function loginInt (req, res, next) {
    var prueba={
        process:"Login",
        nivel:1
    }
    if(req.body.usuario && req.body.clave){
        console.log(req.body.usuario)
        var login =await User.findOne({usuario:req.body.usuario,status:true});
        console.log("LOGININT: "+JSON.stringify(login))
        if(login!=null){
            console.log("Entro en usuario encontrado")
            var verifyPws= await multiFunct.comparePasswrod(req.body.clave,login.clave);
            console.log("Verificando la clave: "+JSON.stringify(verifyPws))
            if(verifyPws){
                console.log("Controlando: "+login)
                var loginDat= await multiFunct.createJSONWebToken(login);
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Ingreso se ha realizado con exito!',
                    respuesta:loginDat
                };
                res.json(respuesta);
            }else{
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Usuario o clave incorrecto'
                };
                res.json(respuesta);
            }
        }else{
            var respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'Usuario o clave incorrecto'
            };
            res.json(respuesta);
        }
    }
    else{
        respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Faltan datos requeridos'
        };
        res.json(respuesta);
    }
};

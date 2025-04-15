'use strict';
var mongoose1 = require('../models/UserModel'),
User = mongoose1.model('Users');
var mongoose2 = require('../models/PermisoModel'),
Permiso = mongoose2.model('Permisos');
var mongoose3 = require('../models/AuditModel'),
Audit = mongoose3.model('Audits');
var mongoose4 = require('../models/AuthyModel'),
Authy = mongoose4.model('Authys');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'fundasistem';
const refreshTokenSecret = 'yourrefreshtokensecrethere';



exports.monthDiff = async (dateFrom, dateTo) => {
    return new Promise(async resolve => {
      resolve(dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear())) )
    })
};
exports.addCeros = async (number, width) => {
    return new Promise(async resolve => {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */ 
        var zero = "0"; /* String de cero */  
        
        if (width <= length) {
            if (number < 0) {
                resolve("-" + numberOutput.toString());
                    // return ("-" + numberOutput.toString()); 
            } else {
                resolve(numberOutput.toString());
                    // return numberOutput.toString(); 
            }
        } else {
            if (number < 0) {
                resolve("-" + (zero.repeat(width - length)) + numberOutput.toString());
                // return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
            } else {
                resolve((zero.repeat(width - length)) + numberOutput.toString());
                // return ((zero.repeat(width - length)) + numberOutput.toString()); 
            }
        }
    })
};
exports.sortPac = async (pacientes,numbFact) => {
    
    return new Promise(async resolve => {
        let newArray=[];
        let data;
        let date=new Date()
        let date1=new Date()
        date=date.toLocaleDateString();
        console.log("Fecha: "+JSON.stringify(date))
        console.log("pacientes: "+JSON.stringify(pacientes))
        let count=0;
        let cant=pacientes.length
        pacientes.forEach(element => { 
            let datIdAfil=null
            let datIdExo=null
            let pacType=null
            console.log(JSON.stringify(element))
            if(element?.idafildats){
                datIdAfil=element.idafildats._id
                pacType='AFILIADO'
            }else if(element?.idexodats){
                datIdExo=element.idexodats._id
                pacType='EXONERADO'
            }
            data={
                idperdats:element.idperdats._id,
                pacName:element.idperdats.nombre+' '+element.idperdats.apellido,
                pacType:pacType,
                idafildats:datIdAfil,
                idexodats:datIdExo,
                numbFact:numbFact,
                fechaPer:date1
            }
            console.log("DATOS: "+JSON.stringify(data))
            newArray.push(data)
            if(cant==count+1){
                resolve(newArray);
            }else{
                count++
            }
            
        });
    })
};
exports.addAudit = async (data) => {
    var newAudit = new Audit(data);
    var audit=await newAudit.save();
    return audit;
};
// module.exports = function (app) {
exports.authenticateJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;
    console.log("Header: "+authHeader)
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log("Token: "+token)
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Su sesión a expirado'
                };
                
                return res.json(respuesta);
                // return res.sendStatus(403);
            }
            // req.user = user;
            console.log("Verify JWT: " +JSON.stringify(user))
            next();
        });
    } else {
        var respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Faltan datos requeridos'
        };
        
        res.json(respuesta);
    }
};

exports.checkUserAccess = async (id,modulo,menuItem) => {
    return new Promise(async resolve => {
        console.log("Check:"+id+" y "+menuItem)
        Permiso.find({userId:id}, async function (err, acceso) {
            console.log("Acceso: "+JSON.stringify(acceso))
            if(acceso && acceso.length > 0) {
                console.log("Entro 1")
                if(acceso[0].status === false) {
                    return resolve(false);
                }
                console.log("Entro 2")
                // Buscar el módulo por clave del objeto (el nombre del módulo es la key)
                const moduloKey = Object.keys(acceso[0].modulos[0]).find(key => key === modulo);
                console.log("Entro 3")
                if (!moduloKey) {
                    console.log(`Módulo ${modulo} no encontrado en permisos`);
                    return resolve(false);
                }
                console.log("Entro 4")
                const moduloObj = acceso[0].modulos[0][moduloKey];
                console.log("Entro 5")
                if (!moduloObj?.items) {
                    console.log(`Estructura de items incorrecta en módulo ${modulo}`);
                    return resolve(false);
                }
                console.log("Entro 6")
                const itemMenu = moduloObj.items.find(item => item.index === menuItem);
                
                if (!itemMenu) {
                    console.log(`Ítem de menú ${menuItem} no encontrado en módulo ${modulo}`);
                    return resolve(false);
                }
                console.log("Entro 7")
                resolve(itemMenu.value); // Nota: en tu estructura es 'value' no 'valor'
            } else {
                console.log("No se encontraron permisos para el usuario");
                resolve(false);
            }
        }).populate('users', 'usuario');
    })
};
const bcrypt = require('bcrypt');
const saltRounds = 8;
exports.encryptPasswrod = async function (pws) {
    return new Promise(async resolve => {
        bcrypt.hash(pws, saltRounds).then(function(hash) {
            // Store hash in your password DB.
            resolve(hash);
        });
    })
};
exports.comparePasswrod = async function (pws,hash) {
    return new Promise(async resolve => {
        bcrypt.compare(pws, hash).then(function(result) {
            // result == true or false
            resolve(result);
        });
    })
};

exports.createJSONWebToken = async function (login) {
    return new Promise(async resolve => {
        // Generate an access token
        const accessToken = jwt.sign({ username: login.usuario, clave: login.clave }, accessTokenSecret, { expiresIn: 60*60*2 });
        const refreshToken = jwt.sign({ username: login.usuario, clave: login.clave }, refreshTokenSecret);
        // refreshTokens.push(refreshToken);
        // console.log("ESTE ES EL ARRAY = "+JSON.stringify(refreshTokens))
        var data={
            token:accessToken,
            enterTime:new Date(),
            userId:login.userId
        }
        var newAuthy = new Authy(data);
        console.log("Aqui: "+newAuthy)
        Authy.findOneAndUpdate({userId:data.userId},data,{new:true}, async function (err, authyr) {
            if(authyr==null){
                console.log("ENtro en el IF")
                var authy=await newAuthy.save();
                let loginDat={
                    _id:login._id,
                    usuario:login.usuario,
                    userId:authy.userId,
                    token:authy.token,
                    refreshToken:refreshToken
                }
                resolve(loginDat);
            }else{
                console.log("ENtro en el ELSE")
                console.log(authyr)
                console.log(accessToken)
                let loginDat={
                    _id:login._id,
                    usuario:login.usuario,
                    userId:authyr.userId,
                    token:authyr.token,
                    refreshToken:refreshToken
                }
                resolve(loginDat);
            }
        });
    })
};
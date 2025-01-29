'use strict';
var mongoose1 = require('../models/UserModel'),
User = mongoose1.model('Users');
var mongoose2 = require('../models/PerdatModel'),
Perdat = mongoose2.model('Perdats');
var mongoose3 = require('../models/PermisoModel'),
Permiso = mongoose3.model('Permisos');
var multiFunct = require('../functions/exterFunct');//Audit llamaddo

exports.createPermiso = function(req,res){
    createPermisoInt(req,res)
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

async function createPermisoInt (req, res, next) {
    var prueba={
        process:"Crear usuario",
        nivel:'registrar'
    }
    if(req.body.acceso && req.body.userId && req.body.moduloId){
        ///Verificar acceso
        var control= await multiFunct.checkUserNivel(req.body.acceso,prueba.nivel);
        var control=true
        if(!control){
            var respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'No tiene acceso'
            };
            res.json(respuesta);
        }
        ////
        else{
            var data=await Perdat.find({cedula:req.body.userId});
            if(data && data.length==0){
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'No se pudo guardar el Usuario, Debe registrar sus datos'
                };
                res.send(respuesta);
            }else{   
                var data={
                    status:req.body.status,
                    userId:req.body.userId,
                    idperdats:req.body.idperdats,
                    iduserdats:req.body.iduserdats,
                    modulos:req.body.modulos,
                    human:req.body.human
                } 
                var newUser = new User(data);
                newUser.save(async function (err, user) {
                    if (err){
                        var respuesta = {
                            error: true,
                            codigo: 501,
                            mensaje: 'Error inesperado',
                            respuesta:err
                        };
                        res.send(respuesta);
                    }else{
                        var respuesta = {
                            error: false,
                            codigo: 200,
                            mensaje: 'Datos de usuario guardados con exito',
                            respuesta:user
                        };
                        res.json(respuesta);
                        ////Funcion auditora
                        prueba.userId=req.body.acceso;
                        prueba.modulo=req.body.moduloId;
                        var control= await multiFunct.addAudit(prueba);
                        console.log("registrado")
                        ////
                    }
                });
            }
        }
    }else{
        var respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Faltan datos requeridos'
        };
        res.json(respuesta);
    }
};

// exports.readUser = function(req,res){
//     readUserInt(req,res)
//     .catch(e => {
//         console.log('Problemas en el servidor ****: ' + e.message);
//         var respuesta = {
//         error: true,
//         codigo: 501,
//         mensaje: 'Problemas Internos, Contacte con el departamento de informatica'
//         };
//         res.json(respuesta);
//     });
// }

// async function readUserInt (req, res, next) {
//     var prueba={
//         process:"Consultar usuario",
//         nivel:1
//     }
//     if(req.body.acceso && req.body.moduloId){
//         ///Verificar acceso
//         var control= await multiFunct.checkUserNivel(req.body.acceso,prueba.nivel);
//         if(!control){
//             var respuesta = {
//                 error: true,
//                 codigo: 501,
//                 mensaje: 'No tiene acceso'
//             };
//             res.json(respuesta);
//         }
//         ////
//         else{
//             User.
//             findOne({userId:req.params.userId,human:true}).
//             populate('idperdats').
//             exec(async function (err, user) {
//                 if (err){
//                     var respuesta = {
//                         error: true,
//                         codigo: 501,
//                         mensaje: 'Error inesperado',
//                         respuesta:err
//                     };
//                     res.json(respuesta);
//                 }else{
//                     if(user==null){
//                         var respuesta = {
//                             error: false,
//                             codigo: 200,
//                             mensaje: 'El usuario no se encuentra registrado',
//                             respuesta:user
//                         };
//                         res.json(respuesta);
//                     }else{
//                         var respuesta = {
//                             error: false,
//                             codigo: 200,
//                             mensaje: 'Datos de usuario extraidos con exito',
//                             respuesta:user
//                         };
//                         res.json(respuesta);
//                         ////Funcion auditora
//                         prueba.userId=req.body.acceso;
//                         prueba.modulo=req.body.moduloId;
//                         var control= await multiFunct.addAudit(prueba);
//                         console.log("registrado")
//                         ////
//                     }
//                 }
//             });
//         }
//     }else{
//         var respuesta = {
//             error: true,
//             codigo: 502,
//             mensaje: 'Faltan datos requeridos'
//         };
//         res.json(respuesta);
//     }
// };

// exports.updateUser = function(req,res){
//     updateUserInt(req,res)
//     .catch(e => {
//         console.log('Problemas en el servidor ****: ' + e.message);
//         var respuesta = {
//         error: true,
//         codigo: 501,
//         mensaje: 'Problemas Internos, Contacte con el departamento de informatica'
//         };
//         res.json(respuesta);
//     });
// }

// async function updateUserInt (req, res, next) {
//     var prueba={
//         process:"Actualizar usuario",
//         nivel:3
//     }
//     if(req.body.acceso && req.body.moduloId && req.params.userId){
//         ///Verificar acceso
//         var control= await multiFunct.checkUserNivel(req.body.acceso,prueba.nivel);
//         if(!control){
//             var respuesta = {
//                 error: true,
//                 codigo: 501,
//                 mensaje: 'No tiene acceso'
//             };
//             res.json(respuesta);
//         }
//         ////
//         else{
//             req.body.Updated_date=new Date();
//             req.body.userId=req.params.userId;
//             User.findOneAndUpdate({ userId: req.params.userId,human:true },req.body,{new:true}, async function (err, user) {
//                 // console.log("NOSEEE: "+user)
//                 if (err){
//                     var respuesta = {
//                         error: true,
//                         codigo: 501,
//                         mensaje: 'Error inesperado',
//                         respuesta:err
//                     };
//                     res.json(respuesta);
//                 }else{
//                     if(user==null){
//                         var respuesta = {
//                             error: false,
//                             codigo: 200,
//                             mensaje: 'El usuario no se encuentra registrado',
//                             respuesta:user
//                         };
//                         res.json(respuesta);
//                     }else{

//                         var respuesta = {
//                             error: false,
//                             codigo: 200,
//                             mensaje: 'Datos de usuario actualizados con exito',
//                             respuesta:user
//                         };
//                         res.json(respuesta);
//                         ////Funcion auditora
//                         prueba.userId=req.body.acceso;
//                         prueba.modulo=req.body.moduloId;
//                         var control= await multiFunct.addAudit(prueba);
//                         console.log("registrado")
//                         ////
//                     }
//                 }
//             });
//         }
//     }
//     else{
//         var respuesta = {
//             error: true,
//             codigo: 502,
//             mensaje: 'Faltan datos requeridos'
//         };
//         res.json(respuesta);
//     }
// };
// exports.deleteUser = function (req, res, next) {
//     var nivel="4"
//     console.log(req.params.userId)
//     User.remove({ userId: req.params.userId }, function (err, user) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Datos personales Borrados Exitosamente' });
//   });
// };
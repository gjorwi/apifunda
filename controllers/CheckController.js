'use strict';
var mongoose = require('../models/UserModel'),
User = mongoose.model('Users');
var mongoose2 = require('../models/PerdatModel'),
Perdat = mongoose2.model('Perdats');
var mongoose3 = require('../models/PermisoModel'),
Permiso = mongoose2.model('Permisos');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo
const ROOT_USER_MODULES = require('../acceso.json').rootUserModules;

exports.getRootUser = function(req,res){
  getRootUserInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getRootUser'
    };
    res.json(respuesta);
  });
}
async function getRootUserInt (req, res) {
  console.log("ENTRO CHECK")
  console.log("ENTRO CHECK dos veces")
  User.find({human:false},async function (err, user) {
    if (err){
      var respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'Error inesperado',
        respuesta:err
      };
      res.json(respuesta);
    }else{
      console.log("Usuario Root: "+JSON.stringify(user))
      if(user.length<1){
        console.log("Entro en null ")
        var data={
          nombre:"Admin",
          apellido:"Admin",
          sexo: "NA",
          estCiv: "NA",
          parro: "NA",
          muni: "NA",
          sect: "NA",
          cedula:12345678,
          birthday:new Date(),
          human:false
        }
        Perdat.find({cedula:data.cedula,human:false},async function (err, perdat) {
          if(perdat.length<1){
            var newDatRoot = new Perdat(data);
            newDatRoot.save(async function (err, rootDat) {
              console.log("DATOS GUARDADOS: "+JSON.stringify(rootDat))
              if (err){
                var respuesta = {
                  error: true,
                  codigo: 501,
                  mensaje: 'Error inesperado',
                  respuesta:err
                };
                res.json(respuesta);
              }else{
                const pws = await multiFunct.encryptPasswrod("Fundamutual2022..")
                var data2={
                  userId:rootDat.cedula,
                  usuario:"ROOT",
                  idperdats:rootDat._id,
                  clave:pws,
                  human:false
                }
                var newUserRoot = new User(data2);
                newUserRoot.save(async function (err, userRoot) {
                  console.log("DATOS GUARDADOS 2 : "+JSON.stringify(userRoot))
                  if (err){
                    var respuesta = {
                      error: true,
                      codigo: 501,
                      mensaje: 'Error inesperado',
                      respuesta:err
                    };
                    res.json(respuesta);
                  }else{
                    var data3={
                      userId:userRoot.userId,
                      idperdats:userRoot.idperdats,
                      iduserdats:userRoot._id,
                      modulos: ROOT_USER_MODULES,
                      human:false
                    }
                    var newUserPer = new Permiso(data3);
                    newUserPer.save(async function (err, userPer) {
                      console.log("DATOS GUARDADOS 3 : "+JSON.stringify(userPer))
                      if (err){
                        var respuesta = {
                          error: true,
                          codigo: 501,
                          mensaje: 'Error inesperado',
                          respuesta:err
                        };
                        res.json(respuesta);
                      }else{
                        var respuesta = {
                          error: false,
                          codigo: 200,
                          mensaje: 'Inicio Agregado',
                          respuesta:userPer
                        };
                        res.json(respuesta);
                      }
                    });
                  }
                });
              }
            });
          }else{
            console.log("DATOS ENCONTRADOS: "+JSON.stringify(perdat))
            const pws = await multiFunct.encryptPasswrod("Fundamutual2022..")
            var data2={
              userId:perdat[0].cedula,
              usuario:"ROOT",
              idperdats:perdat[0]._id,
              clave:pws,
              human:false
            }
            var newUserRoot = new User(data2);
            newUserRoot.save(async function (err, userRoot) {
              console.log("DATOS GUARDADOS 2 : "+JSON.stringify(userRoot))
              if (err){
                var respuesta = {
                  error: true,
                  codigo: 501,
                  mensaje: 'Error inesperado',
                  respuesta:err
                };
                res.json(respuesta);
              }else{
                var data3={
                  userId:userRoot.userId,
                  idperdats:userRoot.idperdats,
                  iduserdats:userRoot._id,
                  modulos: ROOT_USER_MODULES,
                  human:false
                }
                var newUserPer = new Permiso(data3);
                newUserPer.save(async function (err, userPer) {
                  console.log("DATOS GUARDADOS 3 : "+JSON.stringify(userPer))
                  if (err){
                    var respuesta = {
                      error: true,
                      codigo: 501,
                      mensaje: 'Error inesperado',
                      respuesta:err
                    };
                    res.json(respuesta);
                  }else{
                    var respuesta = {
                      error: false,
                      codigo: 200,
                      mensaje: 'Inicio Agregado',
                      respuesta:userPer
                    };
                    res.json(respuesta);
                  }
                });
              }
            });
          }
        })
      }else{
        Permiso.find({userId:user[0].userId,human:false},async function (err, permiso) {
          if (err){
            var respuesta = {
              error: true,
              codigo: 501,
              mensaje: 'Error inesperado',
              respuesta:err
            };
            res.json(respuesta);
          }else{
            console.log("PERMISO: "+JSON.stringify(permiso))
            if(permiso.length>0){
              var respuesta = {
                error: false,
                codigo: 500,
                mensaje: 'Inicio creado',
                respuesta:permiso
              };
              res.json(respuesta);
            }else{
              var data3={
                userId:user[0].userId,
                idperdats:user[0].idperdats,
                iduserdats:user[0]._id,
                modulos: ROOT_USER_MODULES,
                human:false
              }
              var newUserPer = new Permiso(data3);
              newUserPer.save(async function (err, userPer) {
                console.log("DATOS GUARDADOS 3 : "+JSON.stringify(userPer))
                if (err){
                  var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Error inesperado',
                    respuesta:err
                  };
                  res.json(respuesta);
                }else{
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Inicio Agregado 3',
                    respuesta:userPer
                  };
                  res.json(respuesta);
                }
              });
            }
            
          }
        })
        
      }
    }
  });
};
exports.updateAccess = function(req,res){
  updateAccessInt(req,res)
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
async function updateAccessInt (req, res) {
  var prueba={
    process:"Actualizar permisos",
    nivel:'actualizar'
  }
  if(req.body.acceso && req.body.moduloId && req.params.userId){
    ///Verificar acceso
    var control= await multiFunct.checkUserNivel(req.body.acceso,prueba.nivel);
    // var control=true
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
      Permiso.findOneAndUpdate({ userId: req.params.userId,human:true },req.body,{new:true}, async function (err, permiso) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          if(permiso==null){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'El usuario no posee permisos',
              respuesta:permiso
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Permisos de usuario actualizados con exito',
              respuesta:permiso
            };
            res.json(respuesta);
            ////Funcion auditora
            prueba.userId=req.body.acceso;
            prueba.modulo=req.body.moduloId;
            var control= await multiFunct.addAudit(prueba);
            console.log("registrado")
            ////
          }
        }
      });
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
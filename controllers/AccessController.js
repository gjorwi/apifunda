'use strict';
var mongoose = require('../models/PermisoModel'),
Permiso = mongoose.model('Permisos');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.createAccess = function(req,res){
  createAccessInt(req,res)
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
async function createAccessInt (req, res) {
  // var prueba={
  //   process:"Crear permisos",
  //   nivel:'registrar'
  // }
  var prueba={
    process:"Asignar permisos",
    modulo:"config",
    menuItem:4
  }
  if(req.body.acceso && req.body.moduloId){
    ///Verificar acceso
    var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
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
      console.log("BODY: "+JSON.stringify(req.body))
      var data={
        userId:req.body.userId,
        idperdats:req.body.idperdats,
        iduserdats:req.body.iduserdats,
        human:true,
        modulos:req.body.modulos
      }
      var newPermiso = new Permiso(data);
      newPermiso.save(async function (err, permiso) {
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
            mensaje: 'Permisos guardados con exito',
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
    modulo:"config",
    menuItem:13
  }
  if(req.body.acceso && req.body.moduloId && req.params.userId){
    ///Verificar acceso
    var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
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
      req.body.Updated_date=new Date();
      var data={
        status:req.body.status,
        modulos:req.body.modulos,
        Updated_date:req.body.Updated_date
      }
      Permiso.findOneAndUpdate({ userId: req.params.userId,human:true },data,{new:true}, async function (err, permiso) {
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


// exports.deletePerdat = async function (req, res) {
//   var nivel="4";
//   var control= await multiFunct.checkUserNivel(req.body.userId,nivel);///Verificar acceso
//   if(!control)
//     res.send("No tiene acceso");
//   Perdat.remove({ cedula: req.params.perdatId }, function (err, perdat) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Datos personales Borrados Exitosamente' });
//   });
// };
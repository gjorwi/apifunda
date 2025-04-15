'use strict';
var mongoose2 = require('../models/AfiliadoModel'),
Afil = mongoose2.model('Afiliados');
var mongoose3 = require('../models/UpdatesDatModel'),
UpdatesDat = mongoose3.model('UpdatesDats');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.createUpdateAfil = function(req,res){
  createUpdateAfilInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createUpdateAfil'
      };
      res.json(respuesta);
  });
}

async function createUpdateAfilInt (req, res, next) {
  var prueba={
    process:"registrar Actualizacion de datos afiliado",
    modulo:"recepcion",
    menuItem:42
  }
  if(req.body.acceso && req.params.afilId ){
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
        try{
          console.log("Proceso: "+prueba.process)
            const data={
                docanex: req.body.afiliado.docanex,
                reqdocanex: req.body.afiliado.reqdocanex,
                idAfilDats: req.params.afilId,
                idUserDatsCreate: req.body._id
            }
            console.log("Data: "+JSON.stringify(data))
            const newUpdateDats= new UpdatesDat(data)
            console.log("New Update Dats: "+JSON.stringify(newUpdateDats))
            const result = await newUpdateDats.save()
            console.log("Result: "+JSON.stringify(result))
            var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Datos de actualización guardados con éxito',
                respuesta:result
            };
            res.json(respuesta);
            ////Funcion auditora
            prueba.userId=req.body.acceso;
            var control= await multiFunct.addAudit(prueba);
            console.log("registrado")
            ////
          

        }catch(err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
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
exports.readAllUpdatesDat = function(req,res){
  readAllUpdatesDatInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readAllUpdatesDat'
    };
    res.json(respuesta);
  });
}

async function readAllUpdatesDatInt(req, res) {
  var prueba={
    process:"Consultar actualizaciones de datos",
    modulo:"recepcion",
    menuItem:43
  }
  if(req.body.acceso){
    ///Verificar acceso
    var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
    console.log("VALOR CONTROL: "+control)
    // var control=true
    if(!control){
      var respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'No tiene acceso'
      };
      res.json(respuesta);
    }
    ///
    else{
      UpdatesDat.
        find({status:true}).
        populate('idAfilDats').
        populate('idUserDatsCreate').
        populate('idUserDatsUpdate').
        populate({
          path: 'idAfilDats',
          populate: {
            path: 'idperdats'
          }
        }).
        exec(async function (err, solAfidats) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }
        else{
          // if(solAfidats && solAfidats.length==0){
          //   var respuesta = {
          //     error: false,
          //     codigo: 200,
          //     mensaje: 'No se encuentran afiliados registradas',
          //     respuesta:solAfidats
          //   };
          //   res.json(respuesta);
          // }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de afiliados extraidos con exito',
              respuesta:solAfidats
            };
            res.json(respuesta);
            ////Funcion auditora
            console.log("aqui")
            prueba.userId=req.body.acceso;
            var control= await multiFunct.addAudit(prueba);
            ////
          // }
        }
      });
    }
  }
  else{
    var respuesta = {
      error: true,
      codigo: 502,
      mensaje: 'Faltan datos requeridos'
    };
    res.json(respuesta);
  }
};
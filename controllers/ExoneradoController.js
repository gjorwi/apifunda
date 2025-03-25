'use strict';
var mongoose = require('../models/PerdatModel'),
Perdat = mongoose.model('Perdats');
var mongoose2 = require('../models/ExoneradoModel'),
exo = mongoose2.model('Exonerados');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.infoDat = function (req, res) {
  var respuesta = {
    error: true,
    codigo: 200,
    mensaje: 'Punto de inicio'
   };
   res.json(respuesta);
};

exports.readExo = function(req,res){
  readExoInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readExo'
    };
    res.json(respuesta);
  });
}

async function readExoInt (req, res) {
  var prueba={
    process:"Consultar Exonerado",
    modulo:"recepcion",
    menuItem:8
  }
  console.log("DATA: "+JSON.stringify(req.body))
  if(req.body.acceso && req.params.exoId){
    ///Verificar acceso
    var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
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
        let resultFind = await exo.find({exoId:req.params.exoId,status:true})
        .populate('idperdats')
        .populate('idperdatsBen')
        .populate('idModPago')
        .populate( {
          path: 'idModPago',
          populate: [
            {
              path: 'idEspec'
            },
            {
              path: 'servicios'
            }
          ]
        })
        .populate('idServ')
        .populate('idSubServ')
        .exec()
        // console.log("DATA AFILIADO aqui: "+JSON.stringify(resultFind))
        // console.log("DATA AFILIADO aqui: "+JSON.stringify(resultFind.length))
        if(resultFind.length==0){
            var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'No se encuentra exonerado',
                respuesta:resultFind
            };
            res.json(respuesta);
        }else{
            var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Datos de exonerado extraidos con exito',
                respuesta:resultFind
            };
            res.json(respuesta);
            ////Funcion auditora
            prueba.userId=req.body.acceso;
            var control= await multiFunct.addAudit(prueba);
            console.log("registrado")
            ////
        }
      }catch(err){
        console.log("Error: "+JSON.stringify(err))
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
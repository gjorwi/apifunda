'use strict';
var mongoose = require('../models/NominaModel'),
Nomina = mongoose.model('Nominas');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getNomina = function(req,res){
  getNominaInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor getNomina ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getNomina'
    };
    res.json(respuesta);
  });
}

async function getNominaInt(req, res) {
  console.log("ENTRO getDepend")
  var prueba={
    process:"Consultar Nominas",
    modulo:"config",
    menuItem:7
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
    let resultFindNomina = await Nomina.find().exec();
    var respuesta = {
        error: false,
        codigo: 200,
        mensaje: 'Datos de las Nominas extraidas con éxito',
        respuesta:resultFindNomina
    };
    res.json(respuesta);
    ////Funcion auditora
    console.log("aqui")
    prueba.userId=req.body.acceso;
    var control= await multiFunct.addAudit(prueba);
    //// 
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

exports.createNomina = function(req,res){
  createNominaInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createNomina'
    };
    res.json(respuesta);
  });
}
async function createNominaInt (req, res) {
  var prueba={
    process:"Registrar Nomina",
    modulo:"config",
    menuItem:7
  }
  if(req.body.acceso){
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
        console.log(req.body)
        var val=req.body
        let nominaCod;
        let nominaName=val.nomina.toUpperCase()
        let resultFindNomina = await Nomina.findOne({nominaName:nominaName}).exec();
        if(resultFindNomina?.length!=0){
            var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'La Nomina ya se encuentra registrada..',
                respuesta:[]
            };
            res.json(respuesta);
            return
        }
        
        let resultNominaCod = await Nomina.find().sort({nominaCod: -1}).limit(1).select({nominaCod: 1, _id:0}).exec();
        if(resultNominaCod?.length!=0){
            nominaCod=parseInt(resultNominaCod[0]?.nominaCod)+1
            nominaCod= await multiFunct.addCeros(nominaCod,5);
        }else{
            nominaCod=1
            nominaCod= await multiFunct.addCeros(nominaCod,5);
        }
        
        var data={
            nominaCod:nominaCod,
            nominaName:nominaName
        }
        var newNomina= new Nomina(data);
        let newNominaSave = await newNomina.save();
        var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Datos de la Nominaencia guardados con éxito',
            respuesta:newNominaSave
        };
        res.json(respuesta);
        ////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
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

exports.deleteNomina = function(req,res){
  deleteNominaInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteNomina'
    };
    res.json(respuesta);
  });
}
async function deleteNominaInt (req, res) {
    var prueba={
        process:"Eliminar Nomina",
        modulo:"config",
        menuItem:12
    }
    if(req.body.acceso && req.params.nominaId){
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
            try {
                const resultDelete = await Nomina.findByIdAndDelete(req.params.nominaId);
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de la nomina eliminados con éxito',
                    respuesta:resultDelete
                };
                res.json(respuesta);
                ////Funcion auditora
                prueba.userId=req.body.acceso;
                var control= await multiFunct.addAudit(prueba);
                console.log("registrado")
                ////
            } catch(err) {
                console.log(err)
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Error inesperado',
                    respuesta:err
                };
                res.json(respuesta);
            }
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
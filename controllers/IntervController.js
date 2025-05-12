'use strict';
var mongoose = require('../models/IntervModel'),
Interv = mongoose.model('Intervenciones');
var mongoose2 = require('../models/ModPagoModel'),
ModPago = mongoose2.model('Modalidades');
var mongoose3 = require('../models/AtencionesModel'),
Atenciones = mongoose3.model('Atenciones');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getInterv = function(req,res){
  getIntervInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getInterv'
    };
    res.json(respuesta);
  });
}

async function getIntervInt(req, res) {
  console.log("ENTRO GETMUNI")
  var prueba={
    process:"Consultar Intervenciones",
    modulo:"config",
    menuItem:6
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
      console.log("BUSQUEDA municipios: "+JSON.stringify(req.body))
      Interv.find({status:true}).sort({Created_date:-1}).exec( async function (err, munidat) {
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
          console.log("BUSQUEDA intervenciones: "+JSON.stringify(munidat))
          if(munidat && munidat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran intervenciones registradas',
              respuesta:munidat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de las intervenciones extraidas con exito',
              respuesta:munidat
            };
            res.json(respuesta);
            ////Funcion auditora
            console.log("aqui")
            prueba.userId=req.body.acceso;
            var control= await multiFunct.addAudit(prueba);
            ////
          }
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

exports.createInterv = function(req,res){
  createIntervInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createInterv'
    };
    res.json(respuesta);
  });
}
async function createIntervInt (req, res) {
  var prueba={
    process:"Registrar Intervencion",
    modulo:"config",
    menuItem:6
  }
  if(req.body.acceso && req.body.dataInput.length>0 && req.body.servicio && req.body.subServicio && req.body.servicioName && req.body.subServicioName && req.body.fecha && req.body.afidats){
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
      return
    }
    ////
    else{
      console.log(req.body)
      var {_id,dataInput,servicio,servicioCod,subServicio,servicioName,subServicioName,fecha,afidats}=req.body
      console.log("AFIDATS: "+JSON.stringify(afidats))
      dataInput.map(async (item)=>{
        console.log("ITEM: "+JSON.stringify(item.itemDats))
        const result=await ModPago.find({idpresdats:item.itemDats._id}).populate('idEspec')
        console.log("RESULT: "+JSON.stringify(result))
        if(result.length>0){
          //filtrar la modalidad de pago donde el servicio sea igual a servicio
          const result2=result.filter((item)=>item.servicios.includes(servicio))
          console.log("RESULT2: "+JSON.stringify(result2))
          var data={
            idModPago:result2[0]._id,
            especCod:result2[0].idEspec.especCod,
            especialidad:result2[0].idEspec.especName,
            cedPrest:item.itemDats.cedPrest,
            idprestdats:item.itemDats._id,
            servCod:servicioCod,
            idserv:servicio,
            idsubserv:subServicio,
            cedPac:afidats.identificador=="AFILIADO"?afidats.idperdats.cedula:afidats.idperdatsBen.cedula,
            pacType:afidats.identificador=="AFILIADO"?afidats.idperdats.tipo:"EXONERADO",
            idafildats:afidats.identificador=="AFILIADO"?afidats._id:null,
            idexodats:afidats.identificador=="EXONERADO"?afidats._id:null,
            fechAten:fecha,
            idUserDatsCreate:_id,
            
          }
          console.log("DATA PARA INGRESAR ATENCIONES: "+JSON.stringify(data))
          var newAtenciones= new Atenciones(data)
          await newAtenciones.save()
        }
      })
      var respuesta = {
        error: false,
        codigo: 200,
        mensaje: 'Datos de la intervencion guardados con éxito',
        respuesta:[]
      };
      res.json(respuesta);
      // var newInterv= new Interv({dataInput,servicio,subServicio,servicioName,subServicioName,fecha,afidats});
      // console.log("NOSE QUE PASA: "+JSON.stringify(val))
      // newInterv.save(async function (err, intervdat) {
      //   console.log(err)
      //   if (err){
      //     var respuesta = {
      //       error: true,
      //       codigo: 501,
      //       mensaje: 'Error inesperado',
      //       respuesta:err
      //     };
      //     res.json(respuesta);
      //   }else{
      //     var respuesta = {
      //       error: false,
      //       codigo: 200,
      //       mensaje: 'Datos de la intervencion guardados con éxito',
      //       respuesta:intervdat
      //     };
      //     res.json(respuesta);
      //     ////Funcion auditora
      //     prueba.userId=req.body.acceso;
      //     var control= await multiFunct.addAudit(prueba);
      //     console.log("registrado")
      //     ////
      //   }
      // });
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

exports.deleteInterv = function(req,res){
  deleteIntervInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteInterv'
    };
    res.json(respuesta);
  });
}
async function deleteIntervInt (req, res) {
  var prueba={
    process:"Eliminar Intervencion",
    modulo:"config",
    menuItem:12
  }
  if(req.body.acceso && req.params.intervId){
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
      Interv.remove({ _id: req.params.intervId}, async function (err, searchInterv) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log("BORRADO: "+searchInterv)
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de la intervencion eliminados con éxito',
              respuesta:searchInterv
            };
            res.json(respuesta);
          //   ////Funcion auditora
            prueba.userId=req.body.acceso;
            var control= await multiFunct.addAudit(prueba);
            console.log("registrado")
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
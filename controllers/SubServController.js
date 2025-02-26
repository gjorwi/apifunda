'use strict';
var mongoose = require('../models/SubServModel'),
Serv = mongoose.model('Subservicios');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getSubServ = function(req,res){
  getSubServInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getServ'
    };
    res.json(respuesta);
  });
}

async function getSubServInt(req, res) {
  console.log("ENTRO getServ")
  var prueba={
    process:"Consultar Sub Servicios",
    modulo:"regcont",
    menuItem:30
  }
  if(req.body.acceso){
    ///Verificar acceso
    var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
    // console.log("VALOR CONTROL: "+control)
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
      var fechNow= new Date()
      var formatFech=fechNow.getFullYear()+"-"+((fechNow.getMonth()+1)<10 ? "0"+(fechNow.getMonth()+1) : (fechNow.getMonth()+1))+"-"+(fechNow.getDate()<10 ? "0"+fechNow.getDate() : fechNow.getDate())
      console.log("BUSQUEDA servicios: "+JSON.stringify(req.body))
      Serv.find({status:true}).sort({Created_date:-1})
      .populate('idServ')
      .exec( async function (err, servdat) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            fecha:formatFech,
            respuesta:err
          };
          res.json(respuesta);
        }
        else{
          console.log("BUSQUEDA servicios: "+JSON.stringify(servdat))
          if(servdat && servdat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              fecha:formatFech,
              mensaje: 'No se encuentran servicios registrados',
              respuesta:servdat
            };
            res.json(respuesta);
          }else{
            
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de servicios extraidos con exito',
              fecha:formatFech,
              respuesta:servdat
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
exports.getCodSubServ = function(req,res){
  getCodSubServInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getCodServ'
    };
    res.json(respuesta);
  });
}

async function getCodSubServInt(req, res) {
  console.log("ENTRO getServ")
  var prueba={
    process:"Consultar Servicios",
    modulo:"config",
    menuItem:30
  }
  console.log(req.body.acceso)
  if(!req.body.acceso){
    var respuesta = {
      error: true,
      codigo: 502,
      mensaje: 'Faltan datos requeridos'
    };
    return res.json(respuesta);
  }
  var control=true
  if(!control){
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'No tiene acceso'
    };
    return res.json(respuesta);
  }
  let servCod=0;
  console.log("ANTES DEL FIND")
  let findServCode = await Serv.find().sort({servCod: -1}).limit(1).select({servCod: 1, _id:0}).exec(); //when fail its goes to catch
  console.log("DESPUES DEL FIND: "+findServCode)
  
  if(findServCode.length!=0){
    servCod=parseInt(findServCode[0].servCod)+1
    servCod= await multiFunct.addCeros(servCod,4);
  }else{
    servCod=1
    servCod= await multiFunct.addCeros(servCod,4);
  }
  console.log("DESPUES DEL FORMATEAR: "+servCod)
  var respuesta = {
    error: false,
    codigo: 200,
    mensaje: 'Datos de servicios extraidos con exito',
    respuesta:servCod
  };
  res.json(respuesta);
  ////Funcion auditora
  console.log("aqui")
  prueba.userId=req.body.acceso;
  var control= await multiFunct.addAudit(prueba);
  ////
};

exports.createSubServ = function(req,res){
  createSubServInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createServ'
    };
    res.json(respuesta);
  });
}
async function createSubServInt (req, res) {
  var prueba={
    process:"Registrar Servicio",
    modulo:"regcont",
    menuItem:30
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
      var data={
        servName:val.subservicio.toUpperCase(),
        servCod:val.codigo,
        idServ:val.servicio
      }
      var newServ= new Serv(data);
      console.log("NOSE QUE PASA: "+JSON.stringify(data))
      newServ.save(async function (err, servdat) {
        console.log(err)
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
            mensaje: 'Datos del servicio guardados con exito',
            respuesta:servdat
          };
          res.json(respuesta);
          ////Funcion auditora
          prueba.userId=req.body.acceso;
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
exports.deleteSubServ = function(req,res){
  deleteSubServInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteServ'
    };
    res.json(respuesta);
  });
}
async function deleteSubServInt (req, res) {
  var prueba={
    process:"Eliminar Servicio",
    modulo:"actmed",
    menuItem:33
  }
  if(req.body.acceso && req.params.servId){
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
      Serv.findOneAndUpdate({ _id: req.params.servId},{status:false},{new:true}, async function (err, searchServ) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log("BORRADO: "+searchServ)
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos del servicio eliminados con éxito',
              respuesta:searchServ
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
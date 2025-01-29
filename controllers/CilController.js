'use strict';
var mongoose = require('../models/CilindroModel'),
Cil = mongoose.model('Cilindros');
var mongoose = require('../models/DespachoModel'),
Desp = mongoose.model('Despachos');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getCil = function(req,res){
  getCilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getCil'
    };
    res.json(respuesta);
  });
}

async function getCilInt(req, res) {
  console.log("ENTRO GETCIL")
  var prueba={
    process:"Consultar cilindros",
    modulo:"cilindro",
    menuItem:10
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
      console.log("BUSQUEDA CILINDROS: "+JSON.stringify(req.body))
      Cil.find({status:true}, async function (err, cildat) {
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
          console.log("BUSQUEDA CILINDROS: "+JSON.stringify(cildat))
          if(cildat && cildat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran cilindros registrados',
              respuesta:cildat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de los cilindros extraidos con exito',
              respuesta:cildat
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

exports.createCil = function(req,res){
  createCilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createCil'
    };
    res.json(respuesta);
  });
}
async function createCilInt (req, res) {
  var prueba={
    process:"Registrar Cilindro",
    modulo:"cilindro",
    menuItem:9
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
        codCil:val.codCil,
        capCil:val.capCil,
        desCil:val.desCil,
        urlCil:val.urlCil
      }
      var newPerdat = new Cil(data);
      console.log("NOSE QUE PASA: "+JSON.stringify(data))
      newPerdat.save(async function (err, cildat) {
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
            mensaje: 'Datos del cilindro guardados con exito',
            respuesta:cildat
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

exports.readCil = function(req,res){
  readCilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readCil'
    };
    res.json(respuesta);
  });
}

async function readCilInt (req, res) {
  var prueba={
    process:"Concultar cilindro",
    modulo:"cilindro",
    menuItem:10
  }
  console.log("DATA: "+JSON.stringify(req.body))
  if(req.body.acceso && req.params.cilId){
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
      Cil.findOne({codCil:req.params.cilId}, async function (err, cildat) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log("BUSQUEDA CILINDRO: "+JSON.stringify(cildat))
          if(cildat==null){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'El cilindro no se encuentra registrado',
              respuesta:cildat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos del cilindro extraidos con exito',
              respuesta:cildat
            };
            res.json(respuesta);
            ////Funcion auditora
            prueba.userId=req.body.acceso;
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

exports.updateCil = function(req,res){
  updateCilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica updateCil'
    };
    res.json(respuesta);
  });
}

async function updateCilInt (req, res) {
  var prueba={
    process:"Actualizar cilindro",
    modulo:"cilindro",
    menuItem:17
  }
  if(req.body.acceso && req.params.cilId){
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
      req.body.Updated_date=new Date();
      var val=req.body
      var data={
        status:val.status,
        Updated_date:val.Updated_date
      }
      console.log("UPDATE CILINDRO: "+JSON.stringify(data))
      console.log("CILID: "+JSON.stringify(req.params.cilId))
      Cil.findOneAndUpdate({ codCil: req.params.cilId},data,{new:true}, async function (err, cildat) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log("DESPUES DEL UPDATE: "+JSON.stringify(cildat))
          if(cildat==null){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'El cilindro no se encuentra registrado',
              respuesta:cildat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos del cilindro actualizados con exito',
              respuesta:cildat
            };
            res.json(respuesta);
            ////Funcion auditora
            prueba.userId=req.body.acceso;
            var control= await multiFunct.addAudit(prueba);
            console.log("registrado")
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
exports.deleteCil = function(req,res){
  deleteCilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteCil'
    };
    res.json(respuesta);
  });
}
async function deleteCilInt (req, res) {
  var prueba={
    process:"Eliminar cilindro",
    modulo:"cilindro",
    menuItem:16
  }
  if(req.body.acceso && req.params.cilId){
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
      Desp.findOne({ codCil: req.params.cilId,status:true,despachado:true}, async function (err, searchDesp) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log(searchDesp)
          if(searchDesp==null){
            Cil.findOneAndUpdate({ codCil: req.params.cilId},{status:false},{new:true}, async function (err, delCil) {
              if (err){
                var respuesta = {
                  error: true,
                  codigo: 501,
                  mensaje: 'Error inesperado',
                  respuesta:err
                };
                res.json(respuesta);
              }else{
                console.log("TODO BIEN: "+delCil)
                // if(perdat==null){
                //   var respuesta = {
                //     error: false,
                //     codigo: 200,
                //     mensaje: 'La persona no se encuentra registrado',
                //     respuesta:delper
                //   };
                //   res.json(respuesta);
                // }else{
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos del cilindro actualizados con exito',
                    respuesta:delCil
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
          }else{
            var respuesta = {
              error: false,
              codigo: 500,
              mensaje: 'No se puede eliminar ya que existe un despacho para '+req.params.cilId,
              respuesta:searchCil
            };
            // res.json(respuesta);
            // ////Funcion auditora
            // prueba.userId=req.body.acceso;
            // var control= await multiFunct.addAudit(prueba);
            // console.log("registrado")
            // ////
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
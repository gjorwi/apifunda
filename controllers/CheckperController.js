'use strict';
var mongoose = require('../models/PerdatModel'),
Perdat = mongoose.model('Perdats');
var mongoose2 = require('../models/AfiliadoModel'),
Afil = mongoose2.model('Afiliados');
var mongoose3 = require('../models/ExoneradoModel'),
Exo = mongoose3.model('Exonerados');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.infoDat = function (req, res) {
  var respuesta = {
    error: true,
    codigo: 200,
    mensaje: 'Punto de inicio'
   };
   res.json(respuesta);
};

exports.getPerdat = function(req,res){
  getPerdatInt(req,res)
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

async function getPerdatInt(req, res) {
  var prueba={
    process:"Consultar persona",
    modulo:"config",
    menuItem:1
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
      Perdat.find({human:true,status:true}, async function (err, perdat) {
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
          if(perdat && perdat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran personas registradas',
              respuesta:perdat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de persona extraidos con exito',
              respuesta:perdat
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

exports.createPerdat = function(req,res){
  createPerdatInt(req,res)
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
async function createPerdatInt (req, res) {
  var prueba={
    process:"Crear persona",
    modulo:"config",
    menuItem:0
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
        nombre:val.nombre,
        apellido:val.apellido,
        cedula:val.cedula,
        direccion:val.direccion,
        correo:val.correo,
        telefono:val.telefono,
        birthday:val.birthday,
        human:true
      }
      var newPerdat = new Perdat(data);
      newPerdat.save(async function (err, perdat) {
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
            mensaje: 'Datos de persona guardados con exito',
            respuesta:perdat
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

exports.readcheckper = function(req,res){
  readcheckperInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readcheckper'
    };
    res.json(respuesta);
  });
}

async function readcheckperInt (req, res) {
  var prueba={
    process:"Consultar paciente",
    modulo:"histmed",
    menuItem:35
  }
  console.log("DATA: "+JSON.stringify(req.body))
  if(req.body.acceso && req.params.checkperId){
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
        Afil.
        find({status:true})
          .or([{cedtit:req.params.checkperId},{cedpad:req.params.checkperId},{cedmad:req.params.checkperId},{afilId:req.params.checkperId}])
          .populate('idperdats')
          .populate('idtitdats')
          .exec(async function (err, afildat) {
            if (err){
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Error inesperado',
                    respuesta:err
                };
                res.json(respuesta);
            }else{
                console.log("DATA AFILIADO: "+JSON.stringify(afildat))
                if(afildat && afildat?.length==0){
                  const resultGet = await Exo.find({exoId:req.params.checkperId,status:true})
                    .populate('idperdats')
                    .populate('idperdatsBen')
                  if(resultGet && resultGet?.length==0){
                    var respuesta = {
                      error: false,
                      codigo: 200,
                      mensaje: 'No se encuentra el paciente',
                      respuesta:resultGet
                    };
                    return res.json(respuesta);
                  }
                  if(req?.body?.servName?.toUpperCase()==resultGet[0]?.servSol?.toUpperCase()){
                    console.log("COINCIDE")
                    var respuesta = {
                      error: false,
                      codigo: 200,
                      mensaje: 'Datos del paciente extraidos con exito',
                      respuesta:resultGet
                    };
                    return res.json(respuesta);
                  }else{
                    console.log("NO COINCIDE")
                    var respuesta = {
                      error: false,
                      codigo: 200,
                      mensaje: 'Servicio solicitado del paciente exonerado no coincide',
                      respuesta:null
                    };
                    return res.json(respuesta);
                  }
                  
                }else{
                    var respuesta = {
                        error: false,
                        codigo: 200,
                        mensaje: 'Datos de los afiliados extraidos con exito',
                        respuesta:afildat
                    };
                    res.json(respuesta);
                }
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

exports.updatePerdat = function(req,res){
  updatePerdatInt(req,res)
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

async function updatePerdatInt (req, res) {
  var prueba={
    process:"Actualizar persona",
    modulo:"config",
    menuItem:13
  }
  if(req.body.acceso && req.body.moduloId && req.params.perdatId){
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
      var data={
        status:req.body.status,
        direccion:req.body.direccion,
        correo:req.body.correo,
        telefono:req.body.telefono,
        Updated_date:req.body.Updated_date
      }
      Perdat.findOneAndUpdate({ cedula: req.params.perdatId,human:true},req.body,{new:true}, async function (err, perdat) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          if(perdat==null){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'La persona no se encuentra registrado',
              respuesta:perdat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de persona actualizados con exito',
              respuesta:perdat
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
exports.deletePerdat = function(req,res){
  deletePerdatInt(req,res)
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
async function deletePerdatInt (req, res) {
  var prueba={
    process:"Eliminar persona",
    modulo:"config",
    menuItem:12
  }
  if(req.body.acceso && req.params.perdatId){
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
      User.findOne({ userId: req.params.perdatId,human:true,status:true}, async function (err, searchper) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log(searchper)
          if(searchper==null){
            Perdat.findOneAndUpdate({ cedula: req.params.perdatId,human:true},{status:false},{new:true}, async function (err, delper) {
              if (err){
                var respuesta = {
                  error: true,
                  codigo: 501,
                  mensaje: 'Error inesperado',
                  respuesta:err
                };
                res.json(respuesta);
              }else{
                console.log("TODO BIEN: "+delper)
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
                    mensaje: 'Datos de persona actualizados con exito',
                    respuesta:delper
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
              mensaje: 'No se puede eliminar ya que existe un usuario para '+req.params.perdatId,
              respuesta:searchper
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
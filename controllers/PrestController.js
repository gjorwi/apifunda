'use strict';
var mongoose = require('../models/PrestModel'),
Prest = mongoose.model('Prestadores');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo
const { exists } = require('../models/PrestModel');

exports.getPrest = function(req,res){
  getPrestInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getPrest'
    };
    res.json(respuesta);
  });
}

async function getPrestInt(req, res) {
  console.log("ENTRO getPrest")
  var prueba={
    process:"Consultar Prestador",
    modulo:"actmed",
    menuItem:31
  }
  if(req.body.acceso){
    ///Verificar acceso
    // var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
    // console.log("VALOR CONTROL: "+control)
    var control=true
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
      console.log("BUSQUEDA servicios: "+JSON.stringify(req.body))
      Prest.find({status:true})
      .populate('idEspec')
      .sort({Created_date:-1})
      .exec( async function (err, prestdat) {
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
          console.log("BUSQUEDA servicios: "+JSON.stringify(prestdat))
          if(prestdat && prestdat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran prestadores registrados',
              respuesta:prestdat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de prestadores extraidos con exito',
              respuesta:prestdat
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

exports.createPrest = function(req,res){
  createPrestInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createPrest'
    };
    res.json(respuesta);
  });
}
async function createPrestInt (req, res) {
  var prueba={
    process:"Registrar Prestador",
    modulo:"regcont",
    menuItem:31
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
        try{
            console.log(req.body)
            var val=req.body
            var data={
                telPrest:val.telPrest,
                prestName:val.prestName,
                idEspec:val.especialidad,
                cedPrest:val.cedPrest
            }
            var newPrest= new Prest(data);
            let resultFind = await Prest.findOne({cedPrest:data.cedPrest,idEspec:data.idEspec}).exec()
            console.log("NOSE QUE PASA: "+JSON.stringify(newPrest))
            if(resultFind){
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Prestador ya se encuentra registrado.',
                    respuesta:resultFind
                };
                res.json(respuesta);
            }else{
                let saveNewPrest = await newPrest.save();
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos del Prestador guardados con exito',
                    respuesta:saveNewPrest
                };
                res.json(respuesta);
                ////Funcion auditora
                prueba.userId=req.body.acceso;
                var control= await multiFunct.addAudit(prueba);
                console.log("registrado")
                ////
            }
        }catch(err){
            console.log("Error: si"+JSON.stringify(err))
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

exports.readPrest = function(req,res){
  readPrestInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readPrest'
      };
      res.json(respuesta);
  });
}

async function readPrestInt (req, res, next) {
  var prueba={
    process:"Consultar Prestadores",
    modulo:"histmed",
    menuItem:34
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
        let idservdats=[{}]
        if(req.params.prestId!="0000"){
          idservdats=[{idservdats:req.params.prestId}]
        }
        console.log(req.params.prestId)
          Prest
          .find()
          .or(idservdats)
          .populate('idservdats')
          .exec(async function (err, user) {
              if (err){
                var respuesta = {
                  error: true,
                  codigo: 501,
                  mensaje: 'Error inesperado',
                  respuesta:err
                };
                res.json(respuesta);
              }else{
                if(user==null){
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'El prestador no se encuentra registrado',
                    respuesta:user
                  };
                  res.json(respuesta);
                }else{
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de prestador extraidos con exito',
                    respuesta:user
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
exports.readPrestEspec = function(req,res){
  readPrestEspecInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readPrestEspec'
      };
      res.json(respuesta);
  });
}

async function readPrestEspecInt (req, res, next) {
  var prueba={
    process:"Consultar Prestadores segun especialidad",
    modulo:"regcont",
    menuItem:31
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
        // let idservdats=[{}]
        // if(req.params.prestId!="0000"){
        //   idservdats=[{idservdats:req.params.prestId}]
        // }
        console.log(req.params.especId)
          Prest
          .find({status:true,idEspec:req.params.especId})
          // .or(idservdats)
          .populate('idEspec')
          .exec(async function (err, user) {
              if (err){
                var respuesta = {
                  error: true,
                  codigo: 501,
                  mensaje: 'Error inesperado',
                  respuesta:err
                };
                res.json(respuesta);
              }else{
                if(user==null){
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'El prestador no se encuentra registrado',
                    respuesta:user
                  };
                  res.json(respuesta);
                }else{
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de prestador extraidos con exito',
                    respuesta:user
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
exports.updatePrest = function(req,res){
  updatePrestInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica updatePrest'
      };
      res.json(respuesta);
  });
}

async function updatePrestInt (req, res, next) {
  var prueba={
    process:"Actualizar registro/control",
    modulo:"regcont",
    menuItem:22
  }
  console.log("ID PRESTADOR: "+req.params.prestId)
  //Verificar Datos Requeridos
  if(!req.body.acceso && !req.body.moduloId && !req.params.prestId){
    var respuesta = {
      error: true,
      codigo: 502,
      mensaje: 'Faltan datos requeridos'
    };
    return res.json(respuesta);
    
  }
  ///Verificar Acceso
  var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
  if(!control){
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'No tiene acceso'
    };
    return res.json(respuesta);
  }
  try{
    var dataPrest={
      prestName:req.body.prestName,
      cedPrest:req.body.cedPrest,
      idservdats:req.body.idservdats,
      costPac:req.body.costPac,
      typePag:req.body.typePag,
      cantPac:req.body.cantPac,
    }
    var updatevalue = { $set: dataPrest };
    var options = { new: true }
    console.log(JSON.stringify(dataPrest))
    const resultUpdate = await Prest.findByIdAndUpdate(req.params.prestId,updatevalue,options);
    console.log(JSON.stringify(resultUpdate))
    var respuesta = {
      error: false,
      codigo: 200,
      mensaje: 'Datos de prestador actualizados con éxito',
      respuesta:resultUpdate
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
};

exports.deletePrest = function(req,res){
  deletePrestInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deletePrest'
    };
    res.json(respuesta);
  });
}
async function deletePrestInt (req, res) {
  var prueba={
    process:"Eliminar Servicio",
    modulo:"actmed",
    menuItem:33
  }
  if(req.body.acceso && req.params.prestId){
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
      Prest.remove({ _id: req.params.prestId}, async function (err, searchPrest) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log("BORRADO: "+searchPrest)
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos del prestador eliminados con éxito',
              respuesta:searchPrest
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
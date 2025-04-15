'use strict';
var mongoose = require('../models/PerdatModel'),
Perdat = mongoose.model('Perdats');
var mongoose2 = require('../models/SolExoneradoModel'),
SolExo = mongoose2.model('SolExonerados');
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

exports.getSolExo = function(req,res){
  getSolExoInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getSolExo'
    };
    res.json(respuesta);
  });
}

async function getSolExoInt(req, res) {
  var prueba={
    process:"Consultar Solicitud Exonerados",
    modulo:"recepcion",
    menuItem:16
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
      SolExo.
        find({status:true})
        .exec(async function (err, solExodats) {
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
          if(solExodats && solExodats.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran exonerados registradas',
              respuesta:solExodats
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de exonerados extraidos con exito',
              respuesta:solExodats
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

exports.createSolExo = function(req,res){
  createSolExoInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createSolExo'
    };
    res.json(respuesta);
  });
}
async function createSolExoInt (req, res) {
  var prueba={
    process:"Crear Solicitud Exoneración",
    modulo:"recepcion",
    menuItem:11
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
        console.log("ID DE PAGO: "+req.body.idModPago)
        var val=req.body
        try {
            var data2={
                exoId:val.exoCed,
                exoName:val.exoName,
                exoLast:val.exoLast,
                exoSex:val.exoSex,
                exoEstCiv:val.exoEstCiv,
                exoBday:val.exoBday,
                exoCell:val.exoCell,
                exoMuni:val.exoMuni,
                exoParro:val.exoParro,
                exoSect:val.exoSect,
                exoEmail:val.exoEmail,
                exoBenCed:val.exoBenCed,
                exoBenName:val.exoBenName,
                exoBenLast:val.exoBenLast,
                exoBenSex:val.exoBenSex,
                exoBenEstCiv:val.exoBenEstCiv,
                exoBenBday:val.exoBenBday,
                depend:val.depend,
                benSelect:val.benSelect,
                parent:val.parent,
                exoAddress:val.exoAddress,
                reqDocAnex:val.reqDocAnex,
                idUserDatsCreate: req.body._id,
                idModPago:val.idModPago,
                especName:val.especialidadName,
                idServ:val.idServ,
                idSubServ:val.idSubServ,
                other:val.other,
                obs:val.obs,
                human:true
            }
            // console.log("Datos Arreglados para exonerado: "+JSON.stringify(data2))
            // let findPerdats = await SolExo.findOne({exoId:data2.exoId,status:true}).exec();
            if(!val.excentAprob){
              console.log("ENTRO AQUI")
                var newSolExo = new SolExo(data2);
                console.log("Datos SETEADOS para exonerado: "+JSON.stringify(newSolExo))
                let saveSolExo = await newSolExo.save(); //when fail its goes to catch
                console.log("Datos GUARDADOS para exonerado: "+JSON.stringify(saveSolExo))
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de solicitud guardados con exito',
                    respuesta:saveSolExo
                };
                res.json(respuesta);
            }else{
              let resultFindPer = await Perdat.findOne({ cedula: val.exoCed,status:true,human:true}).exec()
            
              console.log("RESULT FIND perdat: "+resultFindPer)
              
              var _id=''
              var _idBen=''
              if(!resultFindPer){
                var data={
                  cedula:val.exoCed,
                  nombre:val.exoName,
                  apellido:val.exoLast,
                  sexo:val.exoSex,
                  estCiv:val.exoEstCiv,
                  birthday:val.exoBday,
                  telefono:val.exoCell,
                  muni:val.exoMuni,
                  parro:val.exoParro,
                  sect:val.exoSect,
                  correo:val.exoEmail,
                  direccion:val.exoAddress,
                  human:true
                }
                var newPerdat = new Perdat(data);
                console.log("RESULT ARREGLO PERDAT"+JSON.stringify(newPerdat))
                var resultSavePer = await newPerdat.save()
                _id=resultSavePer._id
              }else{
                _id=resultFindPer._id
              }
              let resultFindPerBen = await Perdat.findOne({ cedula: val.exoBenCed,status:true,human:true}).exec()
              console.log("RESULT FIND perdat: "+resultFindPerBen)
              if(!resultFindPerBen){
                var data={
                  cedula:val.exoBenCed,
                  nombre:val.exoBenName,
                  apellido:val.exoBenLast,
                  sexo:val.exoBenSex,
                  estCiv:val.exoBenEstCiv,
                  birthday:val.exoBenBday,
                  telefono:val.exoCell,
                  muni:val.exoMuni,
                  parro:val.exoParro,
                  sect:val.exoSect,
                  correo:val.exoEmail,
                  direccion:val.exoAddress,
                  human:true
                }
                var newPerdat = new Perdat(data);
                console.log("RESULT ARREGLO PERDAT"+JSON.stringify(newPerdat))
                var resultSavePer = await newPerdat.save()
                _idBen=resultSavePer._id
              }else{
                _idBen=resultFindPerBen._id
              }
              console.log("llego aqui: "+resultSavePer)
              // resultFind.idperdats=_id
              // resultFind.idperdatsBen=_idBen
                console.log("RESULT id: "+_id)
                console.log("RESULT idBen: "+_idBen)
                var data2={
                  exoId:val.exoBenCed,
                  idperdats:_id,
                  idperdatsBen:_idBen,
                  depend:val.depend,
                  other:val.other,
                  idModPago:val.idModPago,
                  idServ:val.idServ,
                  idSubServ:val.idSubServ,
                  reqDocAnex:val.reqDocAnex,
                  idUserDatsCreate: req.body._id,
                  obs:val.obs,
                  parent:val.parent,
                  benSelect:val.benSelect
                }
                var newExo = new Exo(data2);
                console.log("RESULT ARREGLO afil"+JSON.stringify(newExo))
                let resultSaveAfil = await newExo.save()
                var respuesta = {
                  error: false,
                  codigo: 200,
                  mensaje: 'La solicitud fue aprobada',
                  respuesta:[]
                };
                res.json(respuesta);
            }
            ////Funcion auditora
            prueba.userId=req.body.acceso;
            var control= await multiFunct.addAudit(prueba);
            console.log("registrado")
            ////

        } catch (err) {
            console.log(err)
            var respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'Error inesperado, datos no guardados.',
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

exports.readSolExo = function(req,res){
  readSolExoInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readSolExo'
    };
    res.json(respuesta);
  });
}

async function readSolExoInt (req, res) {
  var prueba={
    process:"Consultar Solicitud Exonerado",
    modulo:"recepcion",
    menuItem:16
  }
  console.log("DATA: "+JSON.stringify(req.body))
  if(req.body.acceso && req.params.solExoId){
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
        SolExo.
        findOne({exoId:req.params.solExoId,status:true}).
        exec(async function (err, exodat) {
            if (err){
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Error inesperado',
                    respuesta:err
                };
                res.json(respuesta);
            }else{
                console.log("DATA AFILIADO: "+JSON.stringify(exodat))
                if(exodat==null){
                  const resultGet = await Perdat.findOne({cedula:req.params.solExoId})
                  if(resultGet){
                    var respuesta = {
                      error: false,
                      codigo: 200,
                      mensaje: 'No se encuentra exonerado, con datos registrados.',
                      respuesta:resultGet
                    };
                    res.json(respuesta);
                  }else{
                    var respuesta = {
                      error: false,
                      codigo: 201,
                      mensaje: 'No se encuentra exonerado, sin datos registrados.',
                      respuesta:resultGet
                    };
                    res.json(respuesta);
                  }
                }else{
                    var respuesta = {
                        error: false,
                        codigo: 200,
                        mensaje: 'Solicitud se encuentra registrada',
                        respuesta:null
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

exports.updateSolExo = function(req,res){
  updateSolExoInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica updateSolExo' 
    };
    res.json(respuesta);
  });
}

async function updateSolExoInt (req, res) {
  var prueba={
    process:"Aprobar Solicitud exoneración",
    modulo:"regcont",
    menuItem:17
  }
  if(req.body.acceso && req.body.respaprob && req.params.solExoId){
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
        console.log("AQUI")
        let resultFindSolExo = await SolExo.findOne({ _id: req.params.solExoId,status:true,$or:[{proceso:"aprobado"},{proceso:"rechazado"}]}).exec()
        console.log("RESULT FIND SOLAFIL: "+resultFindSolExo)
        if(!resultFindSolExo){
          if(req.body.typeAprob==true){
            console.log("ID: "+req.params.solExoId)
            let resultFind = await SolExo.findOneAndUpdate({ _id: req.params.solExoId,status:true,proceso: "pendiente"},{proceso:"aprobado",respaprob:req.body.respaprob,idUserDatsUpdate: req.body.acceso},{new:true}).exec()
            console.log("RESULT FIND TRUE "+resultFind)
            let resultFindPer = await Perdat.findOne({ cedula: resultFind.exoId,status:true,human:true}).exec()
            
            console.log("RESULT FIND perdat: "+resultFindPer)
            
            var _id=''
            var _idBen=''
            if(!resultFindPer){
              var data={
                cedula:resultFind.exoId,
                nombre:resultFind.exoName,
                apellido:resultFind.exoLast,
                sexo:resultFind.exoSex,
                estCiv:resultFind.exoEstCiv,
                birthday:resultFind.exoBday,
                telefono:resultFind.exoCell,
                muni:resultFind.exoMuni,
                parro:resultFind.exoParro,
                sect:resultFind.exoSect,
                correo:resultFind.exoEmail,
                direccion:resultFind.exoAddress,
                human:true
              }
              var newPerdat = new Perdat(data);
              console.log("RESULT ARREGLO PERDAT"+JSON.stringify(newPerdat))
              var resultSavePer = await newPerdat.save()
              _id=resultSavePer._id
            }else{
              _id=resultFindPer._id
            }
            let resultFindPerBen = await Perdat.findOne({ cedula: resultFind.exoBenCed,status:true,human:true}).exec()
            console.log("RESULT FIND perdat: "+resultFindPerBen)
            if(!resultFindPerBen){
              var data={
                cedula:resultFind.exoBenCed,
                nombre:resultFind.exoBenName,
                apellido:resultFind.exoBenLast,
                sexo:resultFind.exoBenSex,
                estCiv:resultFind.exoBenEstCiv,
                birthday:resultFind.exoBenBday,
                telefono:resultFind.exoCell,
                muni:resultFind.exoMuni,
                parro:resultFind.exoParro,
                sect:resultFind.exoSect,
                correo:resultFind.exoEmail,
                direccion:resultFind.exoAddress,
                human:true
              }
              var newPerdat = new Perdat(data);
              console.log("RESULT ARREGLO PERDAT"+JSON.stringify(newPerdat))
              var resultSavePer = await newPerdat.save()
              _idBen=resultSavePer._id
            }else{
              var _idBen=resultFindPerBen._id
            }
            console.log("llego aqui: "+resultSavePer)
            resultFind.idperdats=_id
            resultFind.idperdatsBen=_idBen
            let resultFindExo = await Exo.findOne({ _id: req.params.solExoId,status:true}).exec()
            // if(resultFindExo){
            //   var respuesta = {
            //     error: false,
            //     codigo: 200,
            //     mensaje: 'La solicitud ya fue revisada',
            //     respuesta:[]
            //   };
            //   res.json(respuesta);
            // }else{
              console.log("RESULT id: "+_id)
              console.log("RESULT idBen: "+_idBen)
              console.log("RESULT CHECK: "+resultFind)
              var data2={
                exoId:resultFind.exoId,
                idperdats:resultFind.idperdats,
                idperdatsBen:resultFind.idperdatsBen,
                depend:resultFind.depend,
                other:resultFind.other,
                idModPago:resultFind.idModPago,
                idServ:resultFind.idServ,
                idSubServ:resultFind.idSubServ,
                reqDocAnex:resultFind.reqDocAnex,
                idUserDatsCreate: req.body._id,
                obs:resultFind.obs,
                parent:resultFind.parent,
                benSelect:resultFind.benSelect
              }
              var newExo = new Exo(data2);
              console.log("RESULT ARREGLO afil"+JSON.stringify(newExo))
              let resultSaveAfil = await newExo.save()
              var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'La solicitud fue aprobada',
                // respuesta:{datsPer:resultSavePer,datsAfil:resultSaveAfil}
                respuesta:[]
              };
              res.json(respuesta);
            
          }else if(req.body.typeAprob==false){
            let resultFind = await SolExo.findOneAndUpdate({ _id: req.params.solExoId,status:true,proceso: "pendiente"},{proceso:"rechazado",idUserDatsUpdate: req.body.acceso,respaprob:req.body.respaprob},{new:true}).exec()
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'La solicitud fue rechazada',
              respuesta:resultFind
            };
            res.json(respuesta);
          }
        }else{
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'La solicitud ya fue revisada',
            respuesta:[]
          };
          res.json(respuesta);
        }
        
        ////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
        ////
      }catch(err){
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
exports.deleteSolExo = function(req,res){
  deleteSolExoInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteSolExo'
    };
    res.json(respuesta);
  });
}
async function deleteSolExoInt (req, res) {
  var prueba={
    process:"Eliminar Solicitud Exonerado",
    modulo:"recepcion",
    menuItem:14
  }
  if(req.body.acceso && req.params.solExoId){
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
        console.log(req.params.solExoId)
        let resultFind = await SolExo.findOneAndUpdate({ _id: req.params.solExoId ,status:true,$or:[{ proceso: "aprobado" }, { proceso: "rechazado" }]},{status:false},{new:true}).exec()
        console.log("RESPUESTA UPDATEDELETE: "+JSON.stringify(resultFind))
        if(resultFind!=null){
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Solicitud exonerado vista',
            respuesta:resultFind
          };
          res.json(respuesta);
        }else{
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'No es posible dar por vista la solicitud, antes debe ser Revisada',
            respuesta:resultFind
          };
          res.json(respuesta);
        }
        
        //////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
        ////
      }catch(err){
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
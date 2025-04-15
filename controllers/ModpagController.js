'use strict';
var mongoose = require('../models/ModPagoModel'),
ModPag = mongoose.model('Modalidades');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getMod = function(req,res){
  getModInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getMod'
    };
    res.json(respuesta);
  });
}

exports.updateMod = function(req,res){
  updateModInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica updateMod'
    };
    res.json(respuesta);
  });
}
async function updateModInt (req, res) {
  var prueba={
    process:"Actualizar Modalidad de Pago",
    modulo:"regcont",
    menuItem:22
  }
  if(req.body.acceso && req.params.modId){
    console.log("Entro bien-------------")
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
        var val=req.body
        //actualizar los datos de la modalidad de pago
        // Verificar si ya existe un servicio registrado con las mismas condiciones
        console.log("DATA: ", val.servicios);
        console.log("MOD ID: ", req.params.modId);
        console.log("VAL ID: ", val.idpresdats);
        console.log("VAL ID SPEC: ", val.especId);
        console.log("VAL cant: ", val.cantPac);

        // Buscar coincidencia y obtener el servicio específico
        const existingService = await ModPag.findOne({
          idpresdats: val.idpresdats,
          idEspec: val.especId,
          status: true,
          _id: { $ne: req.params.modId },
          servicios: { $elemMatch: { $in: val.servicios } }
        }).populate('servicios'); // Populate para obtener los detalles del servicio

        // Encontrar qué servicio específico causó la coincidencia
        const matchingService = existingService?.servicios?.find(s => 
          val.servicios.some(vs => vs.toString() === s._id.toString())
        );

        console.log("EXISTING SERVICE: ", existingService);
        if (existingService) {
          var respuesta = {
            error: false,
            codigo: 500,
            mensaje: `El servicio ${matchingService?.servName || 'seleccionado'} ya está registrado en otra modalidad de pago`,
            respuesta: matchingService
          };
          return res.json(respuesta);
        }
        const data={
          servicios:val.servicios,
          typePag:val.typePag,
          cantPac:val.cantPac,
          costPac:val.costPac,
        }
        var updatevalue = { $set: data };
        const result = await ModPag.updateOne(
          { _id: req.params.modId },
          updatevalue
        );
        console.log("UPDATE: ", result)
        console.log('final')
        var respuesta = {
          error: false,
          codigo: 200,
          mensaje: 'Datos de la modalidad guardados con éxito',
          respuesta:result
        };
        res.json(respuesta);
        ////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
        ////
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
}
exports.deleteMod = function(req,res){
  deleteModInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteMod'
    };
    res.json(respuesta);
  });
}
async function deleteModInt (req, res) {
  var prueba={
    process:"Eliminar Modalidad de Pago",
    modulo:"regcont",
    menuItem:23
  }
  if(req.body.acceso && req.params.modId){
    console.log("Entro bien-------------")
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
        var val=req.body
        console.log("MOD ID: ", req.params.modId);

        var updatevalue = { $set: {status:false} };
        const result = await ModPag.updateOne(
          { _id: req.params.modId },
          updatevalue
        );
        console.log("UPDATE: ", result)
        console.log('final')
        var respuesta = {
          error: false,
          codigo: 200,
          mensaje: 'Datos de la modalidad desactivados con éxito',
          respuesta:result
        };
        res.json(respuesta);
        ////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
        ////
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
}

async function getModInt(req, res) {
  console.log("ENTRO getPrest")
  var prueba={
    process:"Consultar Moddalidad de Pago",
    modulo:"regcont",
    menuItem:31
  }
    ///Verificar acceso
    var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
    console.log("VALOR CONTROL: "+control)
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
      ModPag.find({status:true})
      .populate({
        path: 'idpresdats',
        model: 'Prestadores',
        populate: {
            path: 'idEspec',
            model: 'Especialidades'
        }
      })
      .populate({
        path: 'idEspec',
        model: 'Especialidades'
      })
      .populate({
        path: 'servicios',
        model: 'Servicios'
      })
      .sort({Created_date:1})
      .exec( async function (err, modPag) {
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
          console.log("BUSQUEDA servicios: "+JSON.stringify(modPag))
          if(modPag && modPag.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran modalidades registrados',
              respuesta:modPag
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de modalidades extraidos con éxito',
              respuesta:modPag
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
};
exports.getPrestAll = function(req,res){
  getPrestAllInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getPrestAll'
    };
    res.json(respuesta);
  });
}

async function getPrestAllInt(req, res) {
  console.log("ENTRO getPrest")
  var prueba={
    process:"Consultar prestadores",
    modulo:"regcont",
    menuItem:31
  }
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
      ModPag.find({status:true})
      .populate('idpresdats')
      .populate({
        path: 'servicios',
        model: 'Servicios'
      })
      .sort({Created_date:-1})
      .exec( async function (err, prest) {
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
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Datos de prestadores extraidos con éxito',
            respuesta:prest
          };
          res.json(respuesta);
          ////Funcion auditora
          console.log("aqui")
          prueba.userId=req.body.acceso;
          var control= await multiFunct.addAudit(prueba);
          ////
        }
      });
    }
};

exports.createMod = function(req,res){
  createModInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createMod'
    };
    res.json(respuesta);
  });
}
async function createModInt (req, res) {
  var prueba={
    process:"Registrar Prestador",
    modulo:"regcont",
    menuItem:31
  }
  if(req.body.acceso){
    console.log("Entro bien-------------")
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
          var val=req.body
          console.log(`_id doctor: ${JSON.stringify(val)}`)
          var saveNewPrest;
          // await Promise.all(
          //   val.servicios.map(async (servicio)=>{
              let codModPago=0;
              let findCodModPago = await ModPag.find().sort({codModPago: -1}).limit(1).select({codModPago: 1, _id:0}).exec(); //when fail its goes to catch
              
              if(findCodModPago?.length!=0){
                codModPago=parseInt(findCodModPago[0].codModPago)+1
                codModPago= await multiFunct.addCeros(codModPago,5);
              }else{
                codModPago=1
                codModPago= await multiFunct.addCeros(codModPago,5);
              }
              console.log(`CodModPago: ${codModPago}`)
              var data={
                idpresdats:val.idpresdats,
                idEspec:val.idEspec,
                especialidad:val.especName,
                idEspec:val.especId,
                servicios:val.servicios,
                typePag:val.typePag,
                cantPac:val.cantPac,
                costPac:val.costPac,
                codModPago:codModPago
              }
              // Verificar si ya existe un servicio registrado con las mismas condiciones
              const existingService = await ModPag.findOne({
                idpresdats: data.idpresdats,
                idEspec: data.idEspec,
                servicios: { $in: val.servicios },
                status: true
              });

              if (existingService) {
                var respuesta = {
                  error: false,
                  codigo: 500,
                  mensaje: 'Existe un servicio registrado con las mismas condiciones',
                  respuesta:{}
                };
                return res.json(respuesta);
              }

              // Si no existe, procedemos a actualizar y crear el nuevo registro
              var dataModPago = {
                status: false
              }
              var updatevalue = { $set: dataModPago };
              var options = { new: true }
              // const resultUpdate = await ModPag.findOneAndUpdate({idpresdats:data.idpresdats,idEspec:data.idEspec,status:true},updatevalue,options);
              var newModPago = new ModPag(data);
              saveNewPrest = await newModPago.save();
          //   })
          // )
          
          console.log('final')
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Datos de la modalidad guardados con éxito',
            respuesta:saveNewPrest
          };
          res.json(respuesta);
          ////Funcion auditora
          prueba.userId=req.body.acceso;
          var control= await multiFunct.addAudit(prueba);
          console.log("registrado")
          ////
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
    modulo:"regcont",
    menuItem:31
  }
  if(req.body.acceso && req.body.moduloId){
      ///Verificar acceso
    
      var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
      var control=true
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
        console.log("ENTRO getPrest"+req.params.prestId)
        ModPag
          .findOne({idpresdats:req.params.prestId,status:true})
          // .or(idservdats)
          .populate({
            path: 'servicios',
            model: 'Servicios'
          })
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
                    mensaje: 'El prestador no posee una modalidad de pago registrada',
                    respuesta:user
                  };
                  res.json(respuesta);
                }else{
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de modalidad extraidos con exito',
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
exports.readPrestAll = function(req,res){
  readPrestAllInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readPrestAll'
      };
      res.json(respuesta);
  });
}

async function readPrestAllInt (req, res, next) {
  var prueba={
    process:"Consultar modalidades",
    modulo:"regcont",
    menuItem:31
  }
  if(req.body.acceso && req.body.moduloId){
      ///Verificar acceso
    
      var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
      var control=true
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
        console.log("ENTRO getPrest"+req.params.prestId)
        ModPag
          .find({idpresdats:req.params.prestId,status:true})
          // .or(idservdats)
          .populate({
            path: 'servicios',
            model: 'Servicios'
          })
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
                    mensaje: 'El prestador no posee una modalidad de pago registrada',
                    respuesta:user
                  };
                  res.json(respuesta);
                }else{
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de modalidad extraidos con exito',
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

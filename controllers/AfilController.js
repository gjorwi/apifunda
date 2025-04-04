'use strict';
var mongoose = require('../models/PerdatModel'),
Perdat = mongoose.model('Perdats');
var mongoose2 = require('../models/AfiliadoModel'),
Afil = mongoose2.model('Afiliados');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.infoDat = function (req, res) {
  var respuesta = {
    error: true,
    codigo: 200,
    mensaje: 'Punto de inicio'
   };
   res.json(respuesta);
};

exports.readAfil = function(req,res){
  readAfilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readAfil'
    };
    res.json(respuesta);
  });
}

async function readAfilInt (req, res) {
  var prueba={
    process:"Consultar Afiliado",
    modulo:"recepcion",
    menuItem:8
  }
  console.log("DATA: ************"+JSON.stringify(req.body))
  if(req.body.acceso && req.body.moduloId && req.params.afilId){
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
      console.log("ID AFILIADO BUSQUEDA: "+req.params.afilId)
        Afil.
        findOne({afilId:req.params.afilId})
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
              console.log("DATA RESULT ----- "+ afildat)
              if(afildat==null){
                var ced=parseInt(req.params.afilId)
                console.log("CEDULA: "+req.params.afilId)
                console.log("CEDULA: "+ced)
                Perdat.
                findOne({cedula:ced,status:true}).
                // populate('idperdats').
                exec(async function (err, perdat) {
                  if (err){
                    var respuesta = {
                        error: true,
                        codigo: 501,
                        mensaje: 'Error inesperado',
                        respuesta:err
                    };
                    res.json(respuesta);
                  }else{
                    console.log("DATA AFILIADO: "+JSON.stringify(perdat))
                    if(perdat==null){
                      var respuesta = {
                        error: false,
                        codigo: 201,
                        mensaje: 'No se encuentra afiliado, sin datos.',
                        respuesta:afildat
                      };
                      res.json(respuesta);
                    }else{
                      var respuesta = {
                        error: false,
                        codigo: 202,
                        mensaje: 'No se encuentra afiliado, con datos.',
                        respuesta:perdat
                      };
                      res.json(respuesta);
                    }
                  }
                })
              }else{
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de afiliado extraidos con exito',
                    respuesta:afildat
                };
                res.json(respuesta);
              }
              ////Funcion auditora
              prueba.userId=req.body.acceso;
              prueba.modulo=req.body.moduloId;
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
exports.readAfil2 = function(req,res){
  readAfil2Int(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readAfil2'
    };
    res.json(respuesta);
  });
}

async function readAfil2Int (req, res) {
  var prueba={
    process:"Consultar Afiliado",
    modulo:"recepcion",
    menuItem:8
  }
  console.log("DATA: ************"+JSON.stringify(req.body))
  if(req.body.acceso && req.body.moduloId && req.params.afilId){
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
      console.log("ID AFILIADO BUSQUEDA: "+req.params.afilId)
        Afil.
        find({cedtit:req.params.afilId})
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
              console.log("DATA RESULT ----- "+ afildat)
              if(afildat&&afildat.length==0){
                const resultFindBen = await Afil.findOne({afilId:req.params.afilId})
                .populate('idperdats')
                .populate('idtitdats')
                .exec()
                console.log("DATA RESULT ----- "+ resultFindBen)
                if(resultFindBen){
                  let data=[]
                  data.push(resultFindBen)
                  var respuesta = {
                    error: false,
                    codigo: 203,
                    mensaje: 'Datos de afiliado extraidos con exito',
                    respuesta:data
                  };
                  res.json(respuesta);
                }else{
                  var ced=parseInt(req.params.afilId)
                  console.log("CEDULA: "+req.params.afilId)
                  console.log("CEDULA: "+ced)
                  Perdat.
                  findOne({cedula:ced,status:true}).
                  // populate('idperdats').
                  exec(async function (err, perdat) {
                    if (err){
                      var respuesta = {
                          error: true,
                          codigo: 501,
                          mensaje: 'Error inesperado',
                          respuesta:err
                      };
                      res.json(respuesta);
                    }else{
                      console.log("DATA AFILIADO: "+JSON.stringify(perdat))
                      if(perdat==null){
                        var respuesta = {
                          error: false,
                          codigo: 201,
                          mensaje: 'No se encuentra afiliado, sin datos.',
                          respuesta:afildat
                        };
                        res.json(respuesta);
                      }else{
                        var respuesta = {
                          error: false,
                          codigo: 202,
                          mensaje: 'No se encuentra afiliado, con datos.',
                          respuesta:perdat
                        };
                        res.json(respuesta);
                      }
                    }
                  })
                }
              }else{
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de afiliado extraidos con exito',
                    respuesta:afildat
                };
                res.json(respuesta);
              }
              ////Funcion auditora
              prueba.userId=req.body.acceso;
              prueba.modulo=req.body.moduloId;
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
exports.readAfil3 = function(req,res){
  readAfil3Int(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readAfil3'
    };
    res.json(respuesta);
  });
}

async function readAfil3Int (req, res) {
  var prueba={
    process:"Consultar Afiliado",
    modulo:"recepcion",
    menuItem:8
  }
  console.log("DATA: ************"+JSON.stringify(req.body))
  if(req.body.acceso && req.body.moduloId && req.params.afilId){
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
      //evaluar si afilId es una cedula o un nombre, si es cedula buscar por cedtit en AfiliadoModel, si son nombre o apellido buscar en PerdatsModel para extraer la cedula
      console.log("ID AFILIADO BUSQUEDA: "+req.params.afilId)
      let searchQuery;
      if(/^\d+$/.test(req.params.afilId)) {
        searchQuery = {cedtit: req.params.afilId};
      } 
      else {
          // Buscar por nombre/apellido en PerdatsModel primero
          const personas = await Perdat.find({
            $or: [
                {nombre: new RegExp(req.params.afilId, 'i')},
                {apellido: new RegExp(req.params.afilId, 'i')}
            ]
          });
          
          if(personas && personas.length > 0) {
              // Crear array de cédulas encontradas
              const cedulas = personas.map(p => p.cedula);
              searchQuery = {cedtit: {$in: cedulas}};
          } else {
              // Si no hay coincidencias, buscar directamente por el valor
              // searchQuery = {cedtit: req.params.afilId};
              var respuesta = {
                error: false,
                codigo: 201,
                mensaje: 'No se encuentra afiliado, sin datos.',
                respuesta:afildat
              };
              res.json(respuesta);
              return;
          }
      }  
      Afil.
        find(searchQuery)
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
              console.log("DATA RESULT ----- "+ afildat)
              if(afildat&&afildat.length==0){
                const resultFindBen = await Afil.findOne({afilId:req.params.afilId})
                .populate('idperdats')
                .populate('idtitdats')
                .exec()
                console.log("DATA RESULT ----- "+ resultFindBen)
                if(resultFindBen){
                  let data=[]
                  data.push(resultFindBen)
                  var respuesta = {
                    error: false,
                    codigo: 203,
                    mensaje: 'Datos de afiliado extraidos con exito',
                    respuesta:data
                  };
                  res.json(respuesta);
                }else{
                  var ced=parseInt(req.params.afilId)
                  console.log("CEDULA: "+req.params.afilId)
                  console.log("CEDULA: "+ced)
                  Perdat.
                  findOne({cedula:ced,status:true}).
                  // populate('idperdats').
                  exec(async function (err, perdat) {
                    if (err){
                      var respuesta = {
                          error: true,
                          codigo: 501,
                          mensaje: 'Error inesperado',
                          respuesta:err
                      };
                      res.json(respuesta);
                    }else{
                      console.log("DATA AFILIADO: "+JSON.stringify(perdat))
                      if(perdat==null){
                        var respuesta = {
                          error: false,
                          codigo: 201,
                          mensaje: 'No se encuentra afiliado, sin datos.',
                          respuesta:afildat
                        };
                        res.json(respuesta);
                      }else{
                        var respuesta = {
                          error: false,
                          codigo: 202,
                          mensaje: 'No se encuentra afiliado, con datos.',
                          respuesta:perdat
                        };
                        res.json(respuesta);
                      }
                    }
                  })
                }
              }else{
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de afiliado extraidos con exito',
                    respuesta:afildat
                };
                res.json(respuesta);
              }
              ////Funcion auditora
              prueba.userId=req.body.acceso;
              prueba.modulo=req.body.moduloId;
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
exports.readAfilTit = function(req,res){
  readAfilTitInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readAfilTit'
    };
    res.json(respuesta);
  });
}

async function readAfilTitInt (req, res) {
  var prueba={
    process:"Consultar Afiliado",
    modulo:"recepcion",
    menuItem:8
  }
  console.log("DATA: ************"+JSON.stringify(req.body))
  if(req.body.acceso && req.body.moduloId && req.params.afilId){
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
      console.log("ID AFILIADO BUSQUEDA: "+req.params.afilId)
      //buscar type='titular' en minuscula y mayuscula
        Afil.
        findOne({
          afilId: req.params.afilId,
          status: true,
          type: { $regex: /^titular$/i }  // Case-insensitive search
      }).
        populate('idperdats').
        exec(async function (err, afildat) {
            if (err){
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Error inesperado',
                    respuesta:err
                };
                res.json(respuesta);
            }else{
              console.log("DATA RESULT ----- "+ afildat)
              if(afildat==null){
                var respuesta = {
                  error: false,
                  codigo: 201,
                  mensaje: 'No se encuentra afiliado',
                  respuesta:afildat
                };
                res.json(respuesta);
              }else{
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Se encuentra afiliado',
                    respuesta:afildat
                };
                res.json(respuesta);
              }
              ////Funcion auditora
              prueba.userId=req.body.acceso;
              prueba.modulo=req.body.moduloId;
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
exports.updateAfil = function(req,res){
  updateAfilInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica updateAfil'
      };
      res.json(respuesta);
  });
}

async function updateAfilInt (req, res, next) {
  var prueba={
    process:"Actualizar fecha afiliado",
    modulo:"regcont",
    menuItem:31
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
          let fechaActualizada=new Date();
          let resultFind = await Afil.findOneAndUpdate({ _id: req.params.afilId},{Updated_date: fechaActualizada},{new:true}).exec()
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Fecha Actualizada con éxito',
            respuesta:resultFind
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
exports.updateAfil2 = function(req,res){
  updateAfil2Int(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica updateAfil2'
      };
      res.json(respuesta);
  });
}

async function updateAfil2Int (req, res, next) {
  var prueba={
    process:"Actualizar fecha afiliado",
    modulo:"regcont",
    menuItem:31
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
          let fechaActualizada=new Date();
          console.log(JSON.stringify(req.body))
          // let resultFind = await Afil.findOneAndUpdate({ _id: req.params.afilId},{Updated_date: req.body},{new:true}).exec()
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Fecha Actualizada con éxito',
            respuesta:resultFind
          };
          res.json(respuesta);
          ////Funcion auditora
          // prueba.userId=req.body.acceso;
          // var control= await multiFunct.addAudit(prueba);
          // console.log("registrado")
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

exports.createAfilFile = function(req,res){
  createAfilFileInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createAfilFile'
    };
    res.json(respuesta);
  });
}
async function createAfilFileInt (req, res) {
  var prueba={
    process:"Registrar afiliado File",
    modulo:"regcont",
    menuItem:17
  }
  if(req.body.acceso && req.body.result){
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
      console.log(req.body.result)
      var val=req.body.result
      var cont=0
      var count=val.length
      // val.forEach(async element => {
      for(cont;cont<count;cont++){
        try{
          console.log("Al principio: "+cont+" - "+count)
          console.log("NOMBRE FORMATEADO: "+val[cont])
          var data={
            cedula:val[cont].cedula,
            nombre:val[cont].nombre,
            apellido:val[cont].apellido,
            sexo:val[cont].sexo,
            estCiv:val[cont].estCiv,
            birthday:val[cont].birthday,
            telefono:val[cont].telefono,
            muni:val[cont].muni,
            parro:val[cont].parro,
            sect:val[cont].sect,
            correo:val[cont].correo,
            direccion:val[cont].direccion,
            human:true
          }
          var newAfil= new Perdats(data);
          // const result2 = await Afil.findOne({muniName:val[cont].muniName}).exec();
          // console.log("Resultado: "+result2)
          // if(!result2){
          //   console.log("Se registra")
          //     let saveUser = await newAfil.save(); //when fail its goes to catch
          //     // cont++
          //     console.log("Dentro: "+cont+" - "+count)
          //     if(cont==count-1){
          //       console.log("FIN....................")
          //       res.json({error:false,codigo:200,mensaje:"Carga de datos terminada",respuesta:[]})
          //     }
          // }else{
          //   console.log("No se registra")
          //   // cont++
          //   console.log("Dentro2: "+cont+" - "+count)
          //   if(cont==count-1){
          //     console.log("FIN....................")
          //     res.json({error:false,codigo:200,mensaje:"Carga de datos terminada",respuesta:[]})
          //   }
          // }
          var data2={
            afilId:resultFind.afilId,
            idperdats:resultFind.idperdats,
            depend:resultFind.depend,
            nomi:resultFind.nomi,
            depart:resultFind.depart,
            type:resultFind.type,
            cedpad:resultFind.cedpad,
            cedmad:resultFind.cedmad,
            cedtit:resultFind.cedtit,
            idtitdats:resultFindPerdats._id,
            parent:resultFind.parent,
            fechinglab:resultFind.fechinglab,
            reqdocanex:resultFind.reqdocanex,
            docanex:resultFind.docanex,
            obs:resultFind.obs
          }
          // val[cont].muniName=val[cont].muniName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
          // var newMuni= new Muni(val[cont]);
          // const result2 = await Muni.findOne({muniName:val[cont].muniName}).exec();
          // console.log("Resultado: "+result2)
          // if(!result2){
          //   console.log("Se registra")
          //   try {
          //     let saveUser = await newMuni.save(); //when fail its goes to catch
          //     // cont++
          //     console.log("Dentro: "+cont+" - "+count)
          //     if(cont==count-1){
          //       console.log("FIN....................")
          //       res.json({error:false,codigo:200,mensaje:"Carga de datos terminada",respuesta:[]})
          //     }
          //   } catch (err) {
          //     console.log('err' + err);
          //     // cont++
          //     console.log("Dentro: "+cont+" - "+count)
          //     if(cont==count-1){
          //       console.log("FIN....................")
          //       res.json({error:false,codigo:200,mensaje:"Carga de datos terminada",respuesta:[]})
          //     }
          //   }
          // }else{
          //   console.log("No se registra")
          //   // cont++
          //   console.log("Dentro2: "+cont+" - "+count)
          //   if(cont==count-1){
          //     console.log("FIN....................")
          //     res.json({error:false,codigo:200,mensaje:"Carga de datos terminada",respuesta:[]})
          //   }
          // }
        }catch(err){
          console.log("No se registra")
          cont=count+1
          console.log("Dentro2: "+cont+" - "+count)
          console.log("ERROR....................")
          res.json({error:true,codigo:500,mensaje:"Error al cargar el archivo",respuesta:[]})
        }
      }
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

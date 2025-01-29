'use strict';
var mongoose1 = require('../models/UserModel'),
User = mongoose1.model('Users');
var mongoose2 = require('../models/PerdatModel'),
Perdat = mongoose2.model('Perdats');
var mongoose3 = require('../models/PermisoModel'),
Permiso = mongoose3.model('Permisos');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.listUsu = function(req,res){
    listUsuInt(req,res)
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
async function listUsuInt (req, res) {
  // var prueba={
  //   process:"Consultar usuarios y datos persona",
  //   nivel:'consultar'
  // }
  var prueba={
    process:"Consultar usuarios y datos persona",
    modulo:"config",
    menuItem:2
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
      User.
      find({human:true,status:true}).
      populate('idperdats').
      exec(async function (err, users) {
        console.log('Vaina Populate: '+JSON.stringify(users));
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
            mensaje: 'Datos de usuarios extraidos con exito',
            respuesta:users
          };
          res.json(respuesta);
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

exports.userAndDats = function(req,res){
  userAndDatsInt(req,res)
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
async function userAndDatsInt (req, res) {
  // var prueba={
  //   process:"Consultar un usuario y datos",
  //   nivel:'consultar'
  // }
  var prueba={
    process:"Consultar un usuario y datos",
    modulo:"config",
    menuItem:2
  }
  if(req.body.acceso && req.params.userId){
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
      User.
      findOne({userId:req.params.userId,human:true}).
      populate('idperdats').
      exec(async function (err, users) {
        console.log('Vaina Populate: '+JSON.stringify(users));
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          if(users){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de usuarios extraidos con exito',
              respuesta:users
            };
            res.json(respuesta);
            ////Funcion auditora
            prueba.userId=req.body.acceso;
            var control= await multiFunct.addAudit(prueba);
            console.log("registrado")
            ////
          }else{
            Perdat.
            findOne({cedula:req.params.userId,human:true,status:true},async function (err, perdat) {
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
                    mensaje: 'La persona no se encuentra registrada',
                    respuesta:perdat
                  };
                  res.json(respuesta);
                }else{
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de la persona extraidos con exito',
                    respuesta:perdat
                  };
                  res.json(respuesta);
                  ////Funcion auditora
                  prueba.userId=req.body.acceso;
                  prueba.modulo=req.body.moduloId;
                  var control= await multiFunct.addAudit(prueba);
                  console.log("registrado")
                  ////
                }
              }
            })
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

exports.accessAndDats = function(req,res){
  accessAndDatsInt(req,res)
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
async function accessAndDatsInt (req, res) {
  // var prueba={
  //   process:"Consultar un usuario y datos",
  //   nivel:'consultar'
  // }
  var prueba={
    process:"Consultar un usuario y datos",
    modulo:"config",
    menuItem:4
  }
  if(req.body.acceso && req.body.moduloId && req.params.userId){
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
      Permiso.
        findOne({userId:req.params.userId,human:true}).
        populate('idperdats').
        populate('iduserdats').
        exec(async function (err, permisos) {
        console.log('Vaina Populate: '+JSON.stringify(permisos));
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          if(permisos){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de usuario extraidos con exito 1',
              respuesta:permisos
            };
            res.json(respuesta);
            ////Funcion auditora
            prueba.userId=req.body.acceso;
            prueba.modulo=req.body.moduloId;
            var control= await multiFunct.addAudit(prueba);
            console.log("registrado")
            ////
          }else{
            User.
            findOne({userId:req.params.userId,human:true}).
            populate('idperdats').
            exec(async function (err, user) {
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
                    mensaje: 'La persona no se encuentra registrada',
                    respuesta:user
                  };
                  res.json(respuesta);
                }else{
                  var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de usuario extraidos con exito 2',
                    respuesta:user
                  };
                  res.json(respuesta);
                  ////Funcion auditora
                  prueba.userId=req.body.acceso;
                  prueba.modulo=req.body.moduloId;
                  var control= await multiFunct.addAudit(prueba);
                  console.log("registrado")
                  ////
                }
              }
            })
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
exports.customSearch = function(req,res){
  customSearchInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica customSearch'
    };
    res.json(respuesta);
  });
}
async function customSearchInt (req, res) {
  var prueba={
    process:"Buscar una persona",
    modulo:"config",
    menuItem:1
  }
  
  if(req.body.acceso && req.params.userId){
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
      var query={}
      if(req.body.searchType=="cedula"){
        console.log("cedula")
        query={
          cedula:req.params.userId,
          human:true,
          status:true
        }
      }else{
        console.log("nombre")
        query={
          nombre:req.params.userId.toUpperCase(),
          human:true,
          status:true
        }}
      }
      console.log(JSON.stringify(query))
      Perdat
      .findOne(query)
      .exec(async function (err, perdat) {
      console.log('Vaina Populate: '+JSON.stringify(perdat));
      if (err){
        var respuesta = {
          error: true,
          codigo: 501,
          mensaje: 'Error inesperado',
          respuesta:err
        };
        res.json(respuesta);
      }else{
        if(perdat){
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Datos de usuario extraidos con exito 1',
            respuesta:perdat
          };
          res.json(respuesta);
        }else{
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Datos de usuario no encontrados',
            respuesta:perdat
          };
          res.json(respuesta);
        }
        ////Funcion auditora
        prueba.userId=req.body.acceso;
        // prueba.modulo=req.body.moduloId;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
        ////
      }
    });
  }else{
    var respuesta = {
      error: true,
      codigo: 502,
      mensaje: 'Faltan datos requeridos'
    };
    res.json(respuesta);
  }
};
exports.customSearchUsu = function(req,res){
  customSearchUsuInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica customSearchUsu'
    };
    res.json(respuesta);
  });
}
async function customSearchUsuInt (req, res) {
  var prueba={
    process:"Buscar un usuario",
    modulo:"config",
    menuItem:3
  }
  
  if(req.body.acceso && req.params.userId){
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
      var query={}
      if(req.body.searchType=="id"){
        console.log("cedula")
        query={
          userId:req.params.userId,
          human:true,
          status:true
        }
      }else{
        console.log("nombre")
        query={
          usuario:req.params.userId,
          human:true,
          status:true
        }}
      }
      console.log(JSON.stringify(query))
      User
      .findOne(query)
      .populate('idperdats')
      .exec(async function (err, user) {
      console.log('Vaina Populate: '+JSON.stringify(user));
      if (err){
        var respuesta = {
          error: true,
          codigo: 501,
          mensaje: 'Error inesperado',
          respuesta:err
        };
        res.json(respuesta);
      }else{
        if(user){
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Datos de usuario extraidos con exito 1',
            respuesta:user
          };
          res.json(respuesta);
        }else{
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Datos de usuario no encontrados',
            respuesta:user
          };
          res.json(respuesta);
        }
        ////Funcion auditora
        prueba.userId=req.body.acceso;
        // prueba.modulo=req.body.moduloId;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
        ////
      }
    });
  }else{
    var respuesta = {
      error: true,
      codigo: 502,
      mensaje: 'Faltan datos requeridos'
    };
    res.json(respuesta);
  }
};
exports.customChange = function(req,res){
  customChangeInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica customChange'
      };
      res.json(respuesta);
  });
}

async function customChangeInt (req, res, next) {
  var prueba={
      process:"Cambiar contraseña",
      modulo:"config",
      menuItem:5
  }
  if(req.body.acceso && req.params.userId){
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
          console.log("BODY: "+JSON.stringify(req.body))
          const pws = await multiFunct.encryptPasswrod(req.body.clave)
          req.body.clave= pws
          var data={
              clave:req.body.clave,
              Updated_date:req.body.Updated_date
          }
          console.log("despues de clave: "+JSON.stringify(data))
          User.findOneAndUpdate({ userId: req.params.userId,human:true,status:true},data,{new:true}, async function (err, user) {
              // console.log("NOSEEE: "+user)
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
                          mensaje: 'No fue posible cambiar la contraseña',
                          respuesta:user
                      };
                      res.json(respuesta);
                  }else{

                      var respuesta = {
                          error: false,
                          codigo: 200,
                          mensaje: 'Contraseña actualizada con exito',
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
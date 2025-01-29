'use strict';
var mongoose1 = require('../models/UserModel'),
User = mongoose1.model('Users');
var mongoose2 = require('../models/PerdatModel'),
Perdat = mongoose2.model('Perdats');
var mongoose3 = require('../models/PermisoModel'),
Permiso = mongoose3.model('Permisos');
var multiFunct = require('../functions/exterFunct');//Audit llamaddo

exports.getUser = function(req,res){
    getUserInt(req,res)
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

async function getUserInt (req, res, next) {
    var prueba={
        process:"Consultar usuario",
        modulo:"config",
        menuItem:3
      }
    if(req.body.acceso && req.body.moduloId){
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
        ///
        else{
            User.find({human:true}, async function (err, user) {  
                if (err){
                    var respuesta = {
                        error: true,
                        codigo: 501,
                        mensaje: 'Error inesperado',
                        respuesta:err
                    };
                    res.json(respuesta);
                }else{
                    if(user && user.length==0){
                        var respuesta = {
                            error: false,
                            codigo: 200,
                            mensaje: 'No se encuentran usuarios registrado',
                            respuesta:user
                        };
                        res.json(respuesta);
                    }else{
                        var respuesta = {
                            error: false,
                            codigo: 200,
                            mensaje: 'Datos de usuarios extraidos con exito',
                            respuesta:user
                        };
                        ////Funcion auditora
                        prueba.userId=req.body.acceso;
                        prueba.modulo=req.body.moduloId;
                        var control= await multiFunct.addAudit(prueba);
                        ////
                        res.json(respuesta);
                    }
                }
            });
        }
    }
    else{
        respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Faltan datos requeridos'
        };
        res.json(respuesta);
    }
};

exports.createUser = function(req,res){
    createUserInt(req,res)
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

async function createUserInt (req, res, next) {
    var prueba={
        process:"Crear usuario",
        modulo:"config",
        menuItem:2
      }
    if(req.body.acceso && req.body.userId){
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
            var data=await Perdat.find({cedula:req.body.userId,human:true,status:true});
            if(data && data.length==0){
                var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'No se pudo guardar el Usuario, Debe registrar sus datos'
                };
                res.send(respuesta);
            }else{    
                const pws = await multiFunct.encryptPasswrod(req.body.clave)
                req.body.clave= pws
                console.log("BODY: "+JSON.stringify(req.body))
                var data={
                    userId:req.body.userId,
                    idperdats:req.body.idperdats,
                    usuario:req.body.usuario,
                    clave:req.body.clave,
                    human:true
                }
                var newUser = new User(data);
                newUser.save(async function (err, user) {
                    console.log("USER: "+JSON.stringify(user))
                    console.log("ERR: "+JSON.stringify(err))
                    if (err){
                        var respuesta = {
                            error: true,
                            codigo: 501,
                            mensaje: 'Error inesperado ',
                            respuesta:err
                        };
                        res.send(respuesta);
                    }else{
                        var respuesta = {
                            error: false,
                            codigo: 200,
                            mensaje: 'Datos de usuario guardados con exito',
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
                });
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

exports.readUser = function(req,res){
    readUserInt(req,res)
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

async function readUserInt (req, res, next) {
    var prueba={
        process:"Consultar usuario",
        nivel:'consultar'
    }
    if(req.body.acceso && req.body.moduloId){
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
                            mensaje: 'El usuario no se encuentra registrado',
                            respuesta:user
                        };
                        res.json(respuesta);
                    }else{
                        var respuesta = {
                            error: false,
                            codigo: 200,
                            mensaje: 'Datos de usuario extraidos con exito',
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

exports.updateUser = function(req,res){
    updateUserInt(req,res)
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

async function updateUserInt (req, res, next) {
    var prueba={
        process:"Actualizar usuario",
        modulo:"config",
        menuItem:2
    }
    if(req.body.acceso && req.body.moduloId && req.params.userId){
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
            req.body.userId=req.params.userId;
            console.log("BODY: "+JSON.stringify(req.body))
            if(req.body.clave!=''){
                const pws = await multiFunct.encryptPasswrod(req.body.clave)
                req.body.clave= pws
                var data={
                    status:req.body.status,
                    clave:req.body.clave,
                    Updated_date:req.body.Updated_date
                }
            }else{
                var data={
                    status:req.body.status,
                    Updated_date:req.body.Updated_date
                }
            }
            console.log("despues de clave: "+JSON.stringify(data))
            User.findOneAndUpdate({ userId: req.params.userId,human:true},data,{new:true}, async function (err, user) {
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
                            mensaje: 'El usuario no se encuentra registrado',
                            respuesta:user
                        };
                        res.json(respuesta);
                    }else{

                        var respuesta = {
                            error: false,
                            codigo: 200,
                            mensaje: 'Datos de usuario actualizados con exito',
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

exports.deleteUser = function(req,res){
    deleteUserInt(req,res)
    .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteUser'
      };
      res.json(respuesta);
    });
  }
  async function deleteUserInt (req, res) {
    var prueba={
      process:"Eliminar usuario",
      modulo:"config",
      menuItem:12
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
        Permiso.findOne({ userId: req.params.userId,human:true,status:true}, async function (err, searchuser) {
          if (err){
            var respuesta = {
              error: true,
              codigo: 501,
              mensaje: 'Error inesperado',
              respuesta:err
            };
            res.json(respuesta);
          }else{
            console.log("CONSULTA PERMISO: "+searchuser)
            if(searchuser==null){
              User.findOneAndUpdate({ userId: req.params.userId,human:true},{status:false},{new:true}, async function (err, delusu) {
                if (err){
                  var respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'Error inesperado',
                    respuesta:err
                  };
                  res.json(respuesta);
                }else{
                  console.log("TODO BIEN: "+delusu)
                  // if(perdat==null){
                  //   var respuesta = {
                  //     error: false,
                  //     codigo: 200,
                  //     mensaje: 'La persona no se encuentra registrado',
                  //     respuesta:delusu
                  //   };
                  //   res.json(respuesta);
                  // }else{
                    var respuesta = {
                      error: false,
                      codigo: 200,
                      mensaje: 'Datos de persona actualizados con exito',
                      respuesta:delusu
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
                mensaje: 'No se puede eliminar ya que existen permisos asignados a '+req.params.userId,
                respuesta:searchuser
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
'use strict';
var mongoose = require('../models/UserModel'),
User = mongoose.model('Users');
var mongoose2 = require('../models/PerdatModel'),
Perdat = mongoose2.model('Perdats');
var mongoose3 = require('../models/PermisoModel'),
Permiso = mongoose2.model('Permisos');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getRootUser = function(req,res){
  getRootUserInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getRootUser'
    };
    res.json(respuesta);
  });
}
async function getRootUserInt (req, res) {
  console.log("ENTRO CHECK")
  console.log("ENTRO CHECK dos veces")
  User.find({human:false},async function (err, user) {
    if (err){
      var respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'Error inesperado',
        respuesta:err
      };
      res.json(respuesta);
    }else{
      console.log("Usuario Root: "+JSON.stringify(user))
      if(user.length<1){
        console.log("Entro en null ")
        var data={
          nombre:"Admin",
          apellido:"Admin",
          sexo: "NA",
          estCiv: "NA",
          parro: "NA",
          muni: "NA",
          sect: "NA",
          cedula:12345678,
          birthday:new Date(),
          human:false
        }
        Perdat.find({cedula:data.cedula,human:false},async function (err, perdat) {
          if(perdat.length<1){
            var newDatRoot = new Perdat(data);
            newDatRoot.save(async function (err, rootDat) {
              console.log("DATOS GUARDADOS: "+JSON.stringify(rootDat))
              if (err){
                var respuesta = {
                  error: true,
                  codigo: 501,
                  mensaje: 'Error inesperado',
                  respuesta:err
                };
                res.json(respuesta);
              }else{
                const pws = await multiFunct.encryptPasswrod("Fundamutual2022..")
                var data2={
                  userId:rootDat.cedula,
                  usuario:"ROOT",
                  idperdats:rootDat._id,
                  clave:pws,
                  human:false
                }
                var newUserRoot = new User(data2);
                newUserRoot.save(async function (err, userRoot) {
                  console.log("DATOS GUARDADOS 2 : "+JSON.stringify(userRoot))
                  if (err){
                    var respuesta = {
                      error: true,
                      codigo: 501,
                      mensaje: 'Error inesperado',
                      respuesta:err
                    };
                    res.json(respuesta);
                  }else{
                    var data3={
                      userId:userRoot.userId,
                      idperdats:userRoot.idperdats,
                      iduserdats:userRoot._id,
                      modulos:[
                        {name:"config",
                        item:[
                          {index:0,valor:true},
                          {index:1,valor:true},
                          {index:2,valor:true},
                          {index:3,valor:true},
                          {index:4,valor:true},
                          {index:5,valor:true},
                          {index:6,valor:true},
                          {index:7,valor:true},
                          {index:12,valor:true},
                          {index:13,valor:true}
                        ]},
                        {name:"recepcion",
                        item:[
                          {index:8,valor:true},
                          {index:9,valor:true},
                          {index:10,valor:true},
                          {index:11,valor:true},
                          {index:14,valor:true},
                          {index:15,valor:true},
                          {index:16,valor:true},
                          {index:18,valor:true},
                        ]},
                        {name:"regcont",
                        item:[
                          {index:17,valor:true},
                          {index:19,valor:true},
                          {index:20,valor:true},
                          {index:21,valor:true},
                          {index:22,valor:true},
                          {index:23,valor:true},
                          {index:28,valor:true},
                          {index:29,valor:true},
                          {index:30,valor:true},
                          {index:31,valor:true}
                        ]},
                        {name:"direct",
                        item:[
                          {index:24,valor:true},
                          {index:25,valor:true},
                          {index:26,valor:true},
                          {index:27,valor:true}
                        ]},
                        {name:"actmed",
                        item:[
                          
                          {index:32,valor:true},
                          {index:33,valor:true}
                        ]},
                        {name:"histmed",
                        item:[
                          {index:34,valor:true},
                          {index:35,valor:true},
                          {index:36,valor:true},
                          {index:37,valor:true},
                          {index:38,valor:true}
                        ]}
                      ],
                      human:false
                    }
                    var newUserPer = new Permiso(data3);
                    newUserPer.save(async function (err, userPer) {
                      console.log("DATOS GUARDADOS 3 : "+JSON.stringify(userPer))
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
                          mensaje: 'Inicio Agregado',
                          respuesta:userPer
                        };
                        res.json(respuesta);
                      }
                    });
                  }
                });
              }
            });
          }else{
            console.log("DATOS ENCONTRADOS: "+JSON.stringify(perdat))
            const pws = await multiFunct.encryptPasswrod("Fundamutual2022..")
            var data2={
              userId:perdat[0].cedula,
              usuario:"ROOT",
              idperdats:perdat[0]._id,
              clave:pws,
              human:false
            }
            var newUserRoot = new User(data2);
            newUserRoot.save(async function (err, userRoot) {
              console.log("DATOS GUARDADOS 2 : "+JSON.stringify(userRoot))
              if (err){
                var respuesta = {
                  error: true,
                  codigo: 501,
                  mensaje: 'Error inesperado',
                  respuesta:err
                };
                res.json(respuesta);
              }else{
                var data3={
                  userId:userRoot.userId,
                  idperdats:userRoot.idperdats,
                  iduserdats:userRoot._id,
                  modulos:[
                    {name:"config",
                    item:[
                      {index:0,valor:true},
                      {index:1,valor:true},
                      {index:2,valor:true},
                      {index:3,valor:true},
                      {index:4,valor:true},
                      {index:5,valor:true},
                      {index:6,valor:true},
                      {index:7,valor:true},
                      {index:12,valor:true},
                      {index:13,valor:true}
                    ]},
                    {name:"recepcion",
                    item:[
                      {index:8,valor:true},
                      {index:9,valor:true},
                      {index:10,valor:true},
                      {index:11,valor:true},
                      {index:14,valor:true},
                      {index:15,valor:true},
                      {index:16,valor:true},
                      {index:18,valor:true},
                    ]},
                    {name:"regcont",
                    item:[
                      {index:17,valor:true},
                      {index:19,valor:true},
                      {index:20,valor:true},
                      {index:21,valor:true},
                      {index:22,valor:true},
                      {index:23,valor:true},
                      {index:28,valor:true},
                      {index:29,valor:true},
                      {index:30,valor:true},
                      {index:31,valor:true}
                    ]},
                    {name:"direct",
                    item:[
                      {index:24,valor:true},
                      {index:25,valor:true},
                      {index:26,valor:true},
                      {index:27,valor:true}
                    ]},
                    {name:"actmed",
                    item:[
                      
                      {index:32,valor:true},
                      {index:33,valor:true}
                    ]},
                    {name:"histmed",
                    item:[
                      {index:34,valor:true},
                      {index:35,valor:true},
                      {index:36,valor:true},
                      {index:37,valor:true},
                      {index:38,valor:true}
                    ]}
                  ],
                  human:false
                }
                var newUserPer = new Permiso(data3);
                newUserPer.save(async function (err, userPer) {
                  console.log("DATOS GUARDADOS 3 : "+JSON.stringify(userPer))
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
                      mensaje: 'Inicio Agregado',
                      respuesta:userPer
                    };
                    res.json(respuesta);
                  }
                });
              }
            });
          }
        })
      }else{
        Permiso.find({userId:user[0].userId,human:false},async function (err, permiso) {
          if (err){
            var respuesta = {
              error: true,
              codigo: 501,
              mensaje: 'Error inesperado',
              respuesta:err
            };
            res.json(respuesta);
          }else{
            console.log("PERMISO: "+JSON.stringify(permiso))
            if(permiso.length>0){
              var respuesta = {
                error: false,
                codigo: 500,
                mensaje: 'Inicio creado',
                respuesta:permiso
              };
              res.json(respuesta);
            }else{
              var data3={
                userId:user[0].userId,
                idperdats:user[0].idperdats,
                iduserdats:user[0]._id,
                modulos:[
                  {name:"config",
                  item:[
                    {index:0,valor:true},
                    {index:1,valor:true},
                    {index:2,valor:true},
                    {index:3,valor:true},
                    {index:4,valor:true},
                    {index:5,valor:true},
                    {index:6,valor:true},
                    {index:7,valor:true},
                    {index:12,valor:true},
                    {index:13,valor:true}
                  ]},
                  {name:"recepcion",
                  item:[
                    {index:8,valor:true},
                    {index:9,valor:true},
                    {index:10,valor:true},
                    {index:11,valor:true},
                    {index:14,valor:true},
                    {index:15,valor:true},
                    {index:16,valor:true},
                    {index:18,valor:true},
                  ]},
                  {name:"regcont",
                  item:[
                    {index:17,valor:true},
                    {index:19,valor:true},
                    {index:20,valor:true},
                    {index:21,valor:true},
                    {index:22,valor:true},
                    {index:23,valor:true},
                    {index:28,valor:true},
                    {index:29,valor:true},
                    {index:30,valor:true},
                    {index:31,valor:true}
                  ]},
                  {name:"direct",
                  item:[
                    {index:24,valor:true},
                    {index:25,valor:true},
                    {index:26,valor:true},
                    {index:27,valor:true}
                  ]},
                  {name:"actmed",
                  item:[
                    {index:30,valor:true},
                    {index:31,valor:true},
                    {index:32,valor:true},
                    {index:33,valor:true}
                  ]},
                  {name:"histmed",
                  item:[
                    {index:34,valor:true},
                    {index:35,valor:true},
                    {index:36,valor:true},
                    {index:37,valor:true},
                    {index:38,valor:true}
                  ]}
                ],
                human:false
              }
              var newUserPer = new Permiso(data3);
              newUserPer.save(async function (err, userPer) {
                console.log("DATOS GUARDADOS 3 : "+JSON.stringify(userPer))
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
                    mensaje: 'Inicio Agregado 3',
                    respuesta:userPer
                  };
                  res.json(respuesta);
                }
              });
            }
            
          }
        })
        
      }
    }
  });
};
exports.updateAccess = function(req,res){
  updateAccessInt(req,res)
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
async function updateAccessInt (req, res) {
  var prueba={
    process:"Actualizar permisos",
    nivel:'actualizar'
  }
  if(req.body.acceso && req.body.moduloId && req.params.userId){
    ///Verificar acceso
    var control= await multiFunct.checkUserNivel(req.body.acceso,prueba.nivel);
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
      Permiso.findOneAndUpdate({ userId: req.params.userId,human:true },req.body,{new:true}, async function (err, permiso) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          if(permiso==null){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'El usuario no posee permisos',
              respuesta:permiso
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Permisos de usuario actualizados con exito',
              respuesta:permiso
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
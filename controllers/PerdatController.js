'use strict';
var mongoose = require('../models/PerdatModel'),
Perdat = mongoose.model('Perdats');
var mongoose2 = require('../models/UserModel'),
User = mongoose2.model('Users');
var mongoose3 = require('../models/AfiliadoModel'),
Afil = mongoose2.model('Afiliados');
var mongoose4 = require('../models/SolAfiliadoModel'),
SolAfil = mongoose2.model('SolAfiliados');
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
  var prueba = {
    process: "Consultar persona",
    modulo: "config",
    menuItem: 2
  };

  if (req.body.acceso) {
    // Verificar acceso
    var control = await multiFunct.checkUserAccess(req.body.acceso, prueba.modulo, prueba.menuItem);
    console.log("VALOR CONTROL: " + control);

    if (!control) {
      var respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'No tiene acceso'
      };
      return res.json(respuesta);
    }

    // Obtener parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    try {
      // Obtener total de documentos
      const total = await Perdat.countDocuments({ human: true, status: true });

      // Obtener datos paginados
      const perdat = await Perdat.find({ human: true, status: true })
        .skip(skip)
        .limit(limit);

      const respuesta = {
        error: false,
        codigo: 200,
        mensaje: 'Datos de persona extraídos con éxito',
        respuesta: {
          data: perdat,
          // page,
          totalPages: Math.ceil(total / limit),
          totalItems: total
        }
      };

      res.json(respuesta);

      // Función auditora
      prueba.userId = req.body.acceso;
      await multiFunct.addAudit(prueba);
    } catch (err) {
      const respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'Error inesperado',
        respuesta: err.message
      };
      res.json(respuesta);
    }
  } else {
    var respuesta = {
      error: true,
      codigo: 502,
      mensaje: 'Faltan datos requeridos'
    };
    res.json(respuesta);
  }
}

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
        sexo:val.sexo,
        estCiv:val.estCiv,
        cedula:val.cedula,
        direccion:val.direccion,
        muni:val.muni,
        parro:val.parro,
        sect:val.sect,
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

exports.readPerdat = function(req,res){
  readPerdatInt(req,res)
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

async function readPerdatInt (req, res) {
  var prueba={
    process:"Consoltar persona",
    modulo:"config",
    menuItem:2
  }
  console.log("DATA: "+JSON.stringify(req.body))
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
      Perdat.findOne({cedula:req.params.perdatId,human:true}, async function (err, perdat) {
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
        nombre:req.body.nombre,
        apellido:req.body.apellido,
        sexo:req.body.sexo,
        estCiv:req.body.estCiv,
        birthday:req.body.birthday,
        direccion:req.body.direccion,
        muni:req.body.muni,
        parro:req.body.parro,
        sect:req.body.sect,
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
      try{
        let resultFindAfil = await Afil.findOne({ afilId: req.params.perdatId,status:true}).exec()
        let resultFindUser = await User.findOne({ userId: req.params.perdatId,status:true,human:true}).exec()
        let resultFindSolAfil = await SolAfil.findOne({ afilId: req.params.perdatId,status:true}).exec()

        if(!resultFindAfil && !resultFindUser && !resultFindSolAfil){
          let resultFindPerdats = await Perdat.findOneAndUpdate({ cedula: req.params.perdatId,human:true},{status:false},{new:true}).exec()
          console.log("RESULT DELETE PERDATS: "+resultFindPerdats)
          if(!resultFindPerdats){
            var respuesta = {
              error: true,
              codigo: 501,
              mensaje: 'Error inesperado',
              respuesta:[]
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de persona actualizados con exito',
              respuesta:resultFindPerdats
            };
            res.json(respuesta);
          }
        }else{
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'No puede ser eliminado ya que pertenece a otra instancia',
            respuesta:[]
          };
          res.json(respuesta);
        }
        //////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
        ////
      }catch(err){
        console.log("ERROR DELETE PERDATS: "+err)
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
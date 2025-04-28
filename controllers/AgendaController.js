'use strict';
var mongoose = require('../models/AgendaModel'),
Agend = mongoose.model('Agendas');
var mongoose2 = require('../models/ExoneradoModel'),
Exonerados = mongoose2.model('Exonerados');
var mongoose3 = require('../models/AfiliadoModel'),
Afiliados = mongoose3.model('Afiliados');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getAgenda = function(req,res){
  getAgendaInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getAgenda'
    };
    res.json(respuesta);
  });
}

async function getAgendaInt(req, res) {
  console.log("ENTRO getAgenda")
  var prueba={
    process:"Consultar Agendas",
    modulo:"histmed",
    menuItem:35
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
      var fechaNow=new Date()
      var formatFech = fechaNow.getFullYear()+"-"+((fechaNow.getMonth()+1)<10 ? "0"+(fechaNow.getMonth()+1) : (fechaNow.getMonth()+1))+"-"+(fechaNow.getDate()<10 ? "0"+fechaNow.getDate() : fechaNow.getDate())
      console.log("Fecha: "+JSON.stringify(formatFech))
      console.log("BUSQUEDA Agendas: "+JSON.stringify(req.body))
      Agend.find({status:true,proceso:"pendiente"})
      .populate({
        path: 'idModPago',
        model: 'Modalidades',
        populate: {
            path: 'servicios',
            model: 'Servicios'
        }
      })
      .populate('idprestdats')
      .populate('idEspec')
      .populate('pacientes.idperdats')
      .sort({fechAgen:-1})
      .exec( async function (err, agenddat) {
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
          console.log("BUSQUEDA servicios: "+JSON.stringify(agenddat))
          if(agenddat && agenddat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran',
              respuesta:agenddat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de agendas extraidos con exito',
              respuesta:agenddat
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
exports.getAgendaPer = function(req,res){
  getAgendaPerInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getAgendaPer'
    };
    res.json(respuesta);
  });
}

async function getAgendaPerInt(req, res) {
  console.log("ENTRO getAgendaPer")
  var prueba={
    process:"Consultar Agendas",
    modulo:"histmed",
    menuItem:36
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
      var fechaNow=new Date()
      var formatFech = fechaNow.getFullYear()+"-"+((fechaNow.getMonth()+1)<10 ? "0"+(fechaNow.getMonth()+1) : (fechaNow.getMonth()+1))+"-"+(fechaNow.getDate()<10 ? "0"+fechaNow.getDate() : fechaNow.getDate())
      console.log("Fecha: "+JSON.stringify(formatFech))
      console.log("BUSQUEDA Agendas: "+JSON.stringify(req.body))
      Agend.find({status:true,fechAgen: { $lte: formatFech },proceso:"pendiente"})
      .populate({
        path: 'idModPago',
        model: 'Modalidades',
        populate: {
            path: 'servicios',
            model: 'Servicios'
        }
      })
      .populate('idEspec')
      .populate('idprestdats')
      .populate('pacientes.idperdats')
      .populate('pacientes.idafildats')
      .populate('pacientes.idexodats')
      .sort({fechAgen:-1})
      .exec( async function (err, agenddat) {
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
          console.log("BUSQUEDA servicios: "+JSON.stringify(agenddat))
          if(agenddat && agenddat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran',
              respuesta:agenddat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de agendas extraidos con exito',
              respuesta:agenddat
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
exports.getAgendaVist = function(req,res){
  getAgendaVistInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getAgendaVist'
    };
    res.json(respuesta);
  });
}

async function getAgendaVistInt(req, res) {
  console.log("ENTRO getAgendaVist")
  var prueba={
    process:"Consultar Agendas Vistas",
    modulo:"regcont",
    menuItem:44
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
      var fechaNow=new Date()
      var formatFech = fechaNow.getFullYear()+"-"+((fechaNow.getMonth()+1)<10 ? "0"+(fechaNow.getMonth()+1) : (fechaNow.getMonth()+1))+"-"+(fechaNow.getDate()<10 ? "0"+fechaNow.getDate() : fechaNow.getDate())
      console.log("Fecha: "+JSON.stringify(formatFech))
      console.log("BUSQUEDA Agendas: "+JSON.stringify(req.body))
      Agend.find({status:true,proceso:"visto"})
      .populate({
        path: 'idModPago',
        model: 'Modalidades',
        populate: {
            path: 'servicios',
            model: 'Servicios'
        }
      })
      .populate({
        path: 'idEspec',
        model: 'Especialidades'
      })
      .populate({
        path: 'idModPago',
        model: 'Modalidades',
        populate: {
            path: 'idEspec',
            model: 'Especialidades'
        }
      })
      .populate({
        path: 'pacientes.servicios.idServ',
        model: 'Servicios'
      })
      .populate({
        path: 'pacientes.servicios.idSubServ',
        model: 'Subservicios'
      })
      .populate('idprestdats')
      .populate('pacientes.idperdats')
      .populate('pacientes.idafildats')
      .populate('pacientes.idexodats')
      .sort({fechAgen:-1})
      .exec( async function (err, agenddat) {
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
          console.log("BUSQUEDA agendas: "+JSON.stringify(agenddat))
          if(agenddat && agenddat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran',
              respuesta:agenddat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de agendas extraidos con exito',
              respuesta:agenddat
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
exports.getAgendaLiq = function(req,res){
  getAgendaLiqInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getAgendaLiq'
    };
    res.json(respuesta);
  });
}

async function getAgendaLiqInt(req, res) {
  console.log("ENTRO getAgendaLiq")
  var prueba={
    process:"Consultar Agendas Liquidados",
    modulo:"regcont",
    menuItem:44
  }
  if(req.body.acceso && req.params.fecha){
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
      var fechaNow=req.params.fecha
      console.log("Fecha: "+JSON.stringify(fechaNow))
      console.log("BUSQUEDA Agendas: "+JSON.stringify(req.body))
      Agend.find({status:true,proceso:"liquidado",fechAgen:fechaNow})
      .populate({
        path: 'idModPago',
        model: 'Modalidades',
        populate: {
            path: 'servicios',
            model: 'Servicios'
        }
      })
      .populate({
        path: 'idEspec',
        model: 'Especialidades'
      })
      .populate({
        path: 'idModPago',
        model: 'Modalidades',
        populate: {
            path: 'idEspec',
            model: 'Especialidades'
        }
      })
      .populate({
        path: 'pacientes.servicios.idServ',
        model: 'Servicios'
      })
      .populate({
        path: 'pacientes.servicios.idSubServ',
        model: 'Subservicios'
      })
      .populate('idprestdats')
      .populate('pacientes.idperdats')
      .populate('pacientes.idafildats')
      .populate('pacientes.idexodats')
      .sort({fechAgen:-1})
      .exec( async function (err, agenddat) {
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
          console.log("BUSQUEDA agendas: "+JSON.stringify(agenddat))
          if(agenddat && agenddat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran',
              respuesta:agenddat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de agendas extraidos con exito',
              respuesta:agenddat
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

exports.createAgenda = function(req,res){
  createAgendaInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createAgenda'
    };
    res.json(respuesta);
  });
}
async function createAgendaInt (req, res) {
  var prueba={
    process:"Registrar Agenda",
    modulo:"histmed",
    menuItem:34
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
            ////AGREGAR FECHA PERSONALIZADA con el siguiente formato 'Lunes 25 de Abril del 2023'
            const fecha = new Date(val.fechAgen);
            const options = {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            };
            const formatFech = fecha.toLocaleDateString('es-ES', options)
              .replace(/,/g, '')  // Elimina comas si las hubiera
              .replace(/(\d+) de (\w+) del?/, '$1 de $2 del'); // Asegura formato "del"


            // if(parseInt(format[0]+format[1]+format[2]) >= parseInt(splitNow[0]+splitNow[1]+splitNow[2])){
                var data={
                    countPac:val.countPac,
                    idModPago:val.idModPago,
                    idEspec:val.especialidad,
                    idprestdats:val.doctor,
                    idUserDatsCreate: req.body._id,
                    fechAgen:val.fechAgen,
                    fechaPer:formatFech
                }
                var newAgend= new Agend(data);
                console.log("Datos Set: "+JSON.stringify(newAgend))
                let resultFind = await Agend.findOne({idEspec:data.idEspec,fechaPer:data.fechaPer,idprestdats:data.idprestdats,proceso:"pendiente"}).exec()
                console.log("NOSE QUE PASA: "+JSON.stringify(newAgend))
                if(resultFind){
                    var respuesta = {
                        error: false,
                        codigo: 200,
                        mensaje: 'La agenda ya se encuentra registrada',
                        respuesta:resultFind
                    };
                    res.json(respuesta);
                }else{
                    let saveNewAgend = await newAgend.save();
                    var respuesta = {
                        error: false,
                        codigo: 200,
                        mensaje: 'Agenda guardada con éxito',
                        respuesta:saveNewAgend
                    };
                    res.json(respuesta);
                    ////Funcion auditora
                    prueba.userId=req.body.acceso;
                    var control= await multiFunct.addAudit(prueba);
                    console.log("registrado")
                    ////
                }
            // }else{
            //     console.log("Menor")
            //     var respuesta = {
            //         error: true,
            //         codigo: 501,
            //         mensaje: 'La fecha de agenda no puede ser menor a la fecha de creación',
            //         respuesta:[]
            //     };
            //     res.json(respuesta);
            // }
        }catch(err){
            console.log("Error: si"+err)
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


exports.updateAgenda = function(req,res){
  updateAgendaInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica updateAgenda'
      };
      res.json(respuesta);
  });
}

async function updateAgendaInt (req, res, next) {
  var prueba={
    process:"Asignar Cistas",
    modulo:"histmed",
    menuItem:35
  }
  if(req.body.acceso && req.params.agendaId ){
      ///Verificar acceso
      console.log("Verificar acceso NO ENTIENDOOOOO")
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
          let resultFindAgend = await Agend.findOne({ _id: req.params.agendaId}).exec()
          console.log("Resultado de busqueda de agenda: "+JSON.stringify(resultFindAgend))
          if(resultFindAgend.pacientes.length<resultFindAgend.countPac){
            let filt=resultFindAgend.pacientes.some(e => e.idperdats==req.body.idPac)
            if(filt){
              var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Paciente ya se encuentra registrado en la agenda',
                respuesta:resultFindAgend
              };
              res.json(respuesta);
            }else{
              console.log("Encontro la agenda")
              console.log("Id Afiliado: "+req.body.idafildats)
              let datFech;
              let afildats = await Afiliados.findOne({ _id: req.body.idafildats}).exec()
              if(!afildats){
                let exodats = await Exonerados.findOne({ _id: req.body.idafildats}).exec()
                datFech=exodats
              }else{
                datFech=afildats
              }
              console.log("Dato de afiliados: "+JSON.stringify(afildats))
              
              // let fechFrom=new Date()
              // let fechTo=datFech.Updated_date?new Date(datFech.Updated_date):new Date(datFech.Created_date)
              // var fechUpdated= await multiFunct.monthDiff(fechTo,fechFrom);
              
              // console.log("Fecha de actualizacion: "+JSON.stringify(fechUpdated))
              // if(fechUpdated>12){
              //   var respuesta = {
              //     error: false,
              //     codigo: 200,
              //     mensaje: 'No se pudo agregar, Paciente se encuentra desactualizado.',
              //     respuesta:datFech
              //   };
              //   res.json(respuesta);
              //   return;
              // }
              let dataInsert=null
              if(req.body.type=='AFILIADO'){
                dataInsert={"idperdats" : req.body.idPac,"idafildats" : req.body.idafildats,"typePac" : req.body.type}
              }else if(req.body.type=='EXONERADO'){
                dataInsert={"idperdats" : req.body.idPac,"idexodats" : req.body.idafildats,"typePac" : req.body.type}
              }
              let resultFind = await Agend.findOneAndUpdate({ _id: req.params.agendaId},{$push: {pacientes: dataInsert} },{new:true}).exec()
              var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Paciente agregado con éxito',
                respuesta:resultFind
              };
              res.json(respuesta);
              ////Funcion auditora
              prueba.userId=req.body.acceso;
              var control= await multiFunct.addAudit(prueba);
              console.log("registrado")
              ////
            }
            
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Agenda alcanzó el numero de citas permitidas',
              respuesta:resultFindAgend
            };
            res.json(respuesta);
          }
          

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
exports.getAgendaServPac = function(req,res){
  getAgendaServPacInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getAgendaServPac'
      };
      res.json(respuesta);
  });
}

async function getAgendaServPacInt (req, res, next) {
  var prueba={
    process:"Asignar Servicios a Pacientes",
    modulo:"regcont",
    menuItem:31
  }
  if(req.body.acceso && req.params.agendaId ){
      ///Verificar acceso
      console.log("ENTRO getAgendaServPac")
      console.log("Datos: "+JSON.stringify(req.body))
      console.log("Datos: "+JSON.stringify(req.params))
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
          const result = await Agend.updateOne(
            { _id: req.params.agendaId, 'pacientes._id': req.body.pacienteId },
            { $set: { 'pacientes.$.servicios': req.body.servicios } }
          );
          console.log("Resultado de busqueda de agenda: "+JSON.stringify(result))
          if (result.nModified === 0) {
              return res.json({
                  error: true,
                  codigo: 404,
                  mensaje: 'Paciente no encontrado en la agenda'
              });
          }

          res.json({
              error: false,
              codigo: 200,
              mensaje: 'Servicios actualizados correctamente',
              respuesta: result
          });
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
exports.termAgend = function(req,res){
  termAgendInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica termAgend'
      };
      res.json(respuesta);
  });
}

async function termAgendInt (req, res, next) {
  var prueba={
    process:"Terminar Cistas",
    modulo:"histmed",
    menuItem:35
  }
  if(req.body.acceso && req.params.agendaId ){
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
          let resultFind = await Agend.findOneAndUpdate({ _id: req.params.agendaId},{proceso:"visto",idUserDatsTerminated:req.body._id},{new:true}).exec()
          
          let exoPac=resultFind.pacientes.filter(e => e.typePac=='EXONERADO')
          exoPac?.forEach(async paciente => {
            await Exonerados.findOneAndUpdate({ _id: paciente.idexodats},{proceso:"atendido",status:false},{new:true}).exec()
            
          });
          
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Agenda Terminada',
            respuesta:resultFind
          };
          res.json(respuesta);
          ////Funcion auditora
          prueba.userId=req.body.acceso;
          var control= await multiFunct.addAudit(prueba);
          console.log("registrado")
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
exports.updateAgendaPer = function(req,res){
  updateAgendaPerInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica updateAgendaPer'
      };
      res.json(respuesta);
  });
}

async function updateAgendaPerInt (req, res, next) {
  var prueba={
    process:"Confirmar Cistas",
    modulo:"histmed",
    menuItem:36
  }
  if(req.body.acceso && req.params.agendaId ){
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
        let resultFind = await Agend.findOneAndUpdate({_id: req.params.agendaId},{$set: {"pacientes.$[el].confirmCit": req.body.val } },{ arrayFilters: [{ "el._id": req.body.idPac }],new: true}).exec()
        var mensaje;
        if(req.body.val==true){
          mensaje="Paciente Confirmado"
        }else{
          mensaje="Paciente No Confirmado"
        }
        var respuesta = {
          error: false,
          codigo: 200,
          mensaje: mensaje,
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
exports.readAgenda = function(req,res){
  readAgendaInt(req,res)
  .catch(e => {
      console.log('Problemas en el servidor ****: ' + e.message);
      var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readAgenda'
      };
      res.json(respuesta);
  });
}

async function readAgendaInt (req, res, next) {
  var prueba={
    process:"Consultar Agenda",
    modulo:"histmed",
    menuItem:35
  }
  if(req.body.acceso && req.params.agendaId){
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
          let resultFindAgend = await Agend.findOne({_id:req.params.agendaId,status:true})
            .populate('pacientes.idperdats')
            .exec()
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de agenda encontrados',
              respuesta:resultFindAgend
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
exports.deletePac = function(req,res){
    deletePacInt(req,res)
    .catch(e => {
        console.log('Problemas en el servidor ****: ' + e.message);
        var respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'Problemas Internos, Contacte con el departamento de informatica deletePac'
        };
        res.json(respuesta);
    });
}

async function deletePacInt (req, res, next) {
  var prueba={
    process:"Eliminar Pacientes",
    modulo:"histmed",
    menuItem:38
  }
  if(req.body.acceso && req.params.agendaId && req.body.idperdatsPac && req.body.idPac){
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
        let resultFind = await Agend.findOneAndUpdate({ _id: req.params.agendaId},{$pull: {pacientes: {"_id" : req.body.idPac}} },{new:true}).exec()
        var respuesta = {
          error: false,
          codigo: 200,
          mensaje: 'Paciente eliminado de agenda',
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
exports.deleteAgenda = function(req,res){
  deleteAgendaInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteAgenda'
    };
    res.json(respuesta);
  });
}
async function deleteAgendaInt (req, res) {
  var prueba={
    process:"Eliminar Agenda",
    modulo:"histmed",
    menuItem:38
  }
  if(req.body.acceso && req.params.agendaId){
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
      Agend.updateOne({ _id: req.params.agendaId}, {status:false}, async function (err, searchAgend) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log("BORRADO: "+searchAgend)
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Agenda eliminada con éxito',
              respuesta:searchAgend
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
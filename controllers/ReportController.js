'use strict';
var mongoose = require('../models/FacturasModel'),
Factura = mongoose.model('Facturas');
var mongoose2 = require('../models/PacientesModel'),
Pacientes = mongoose2.model('Pacientes');
var mongoose3 = require('../models/PerdatModel'),
Perdats = mongoose3.model('Perdats');
var mongoose4 = require('../models/AfiliadoModel'),
Afiliados = mongoose4.model('Afiliados');
var mongoose5 = require('../models/ServModel'),
Servicios = mongoose5.model('Servicios');
var mongoose6 = require('../models/PrestModel'),
Prestadores = mongoose6.model('Prestadores');
var mongoose7 = require('../models/ExoneradoModel'),
Exonerados = mongoose7.model('Exonerados');
var mongoose8 = require('../models/ModPagoModel'),
Modalidades = mongoose8.model('Modalidades');
var mongoose9 = require('../models/AtencionesModel'),
Atenciones = mongoose9.model('Atenciones');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getReporte1 = function(req,res){
  getReporte1Int(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getReporte1'
    };
    res.json(respuesta);
  });
}

async function getReporte1Int(req, res) {
  var prueba={
    process:"Crear Reporte1",
    modulo:"regcont",
    menuItem:21
  }
  if(req.body.acceso){
    //Verificar acceso
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
    ///
    else{
      try{
        let arrayQueryFact=[]
        let objectQuery={}
        if(req.body.idServ!="0000"){
          if(req.body.idDoctor!="0000"){
            arrayQueryFact.push({servCod:req.body.servCod})
            arrayQueryFact.push({cedPrest:parseInt(req.body.doctorCod)})
            objectQuery={"$and":arrayQueryFact}
          }else{
            arrayQueryFact.push({servCod:req.body.servCod})
            arrayQueryFact.push({servCod:req.body.servCod})
            objectQuery={"$and":arrayQueryFact}
          }
        }else{
          if(req.body.idDoctor!="0000"){
            arrayQueryFact.push({cedPrest:parseInt(req.body.doctorCod)})
            arrayQueryFact.push({cedPrest:parseInt(req.body.doctorCod)})
            objectQuery={"$and":arrayQueryFact}
          }
        }
        let fecha=new Date(req.body.fechDes);
        let fecha2=new Date(req.body.fechHast);
        fecha2.setDate(fecha2.getDate() + 1)
        let fecha3=new Date("2023,04,15");
        let query={numbFact:"00001"}
        let resultFindFact = await 
        Factura
        .aggregate()
        .match(objectQuery)
        .project(
          {
            numbFact: 1,
            idservdats:1 ,
            idprestdats:1 ,
            cedPrest:1 ,
            servCod:1 ,
            payType:1 ,
            costPac:1 ,
            status:1 ,
            pacientes: {
              "$filter": {
                "input": "$pacientes",
                "as": "paciente",
                "cond": {
                  "$and":[{"$gte":["$$paciente.fechaPer",fecha]},{"$lte":["$$paciente.fechaPer",fecha2]}]
                }
              }
            }
          }
        )
        .exec()
        await Servicios.populate(resultFindFact, {path: "idservdats"});
        await Prestadores.populate(resultFindFact, {path: "idprestdats"});
        await Afiliados.populate(resultFindFact, {path: "pacientes.idafildats"});
        await Exonerados.populate(resultFindFact, {path: "pacientes.idexodats"});
        await Perdats.populate(resultFindFact, [{path: "pacientes.idperdats"},{path: "pacientes.idafildats.idtitdats"},{path: "pacientes.idexodats.idperdatsBen"},,{path: "pacientes.idexodats.idperdats"}]);
        
        var respuesta = {
          error: false,
          codigo: 200,
          mensaje: 'Datos de reporte extraidos con éxito',
          respuesta:resultFindFact
        };
        res.json(respuesta);
        ////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
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
exports.getReporte2 = function(req,res){
  getReporte2Int(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getReporte2'
    };
    res.json(respuesta);
  });
}

async function getReporte2Int(req, res) {
  var prueba={
    process:"Crear Reporte2",
    modulo:"regcont",
    menuItem:21
  }
  if(req.body.acceso){
    //Verificar acceso
    var control= await multiFunct.checkUserAccess(req.body.acceso,prueba.modulo,prueba.menuItem);
    // var control=true
    if(!control){
      var respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'No tiene acceso'
      };
      res.json(respuesta);
      return
    }
    ///
    else{
      //en req.body viene una variable llamada fecha que es un string con la fecha en formato "YYYY-MM-DD" quiero obtener una fecha de inicio y una fecha de fin para hacer la busqueda en la base de datos, donde fecha de inicio comienceel primero del mes y fecha de fin sea el ultimo dia del mes
      console.log(req.body.fecha);
      try{
        // Obtener la fecha del cuerpo de la solicitud
        const fecha = new Date(req.body.fecha);

        // Calcular la fecha de inicio (primer día del mes)
        const fechaInicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1);

        // Calcular la fecha de fin (último día del mes)
        const fechaFin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

        // Convertir las fechas a strings en el formato "YYYY-MM-DD"
        const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
        const fechaFinStr = fechaFin.toISOString().split('T')[0];

        console.log(fechaInicioStr);
        console.log(fechaFinStr);
        let query;
        if(req.body.typeReport=='1'){
          query={
            especCod: req.body.especCod,
            fechAten: { $gte: fechaInicioStr, $lte: fechaFinStr }
          }
        }else {
          query={
            fechAten: { $gte: fechaInicioStr, $lte: fechaFinStr }
          }
        }
        // Realizar la consulta a la base de datos utilizando las fechas calculadas
        const resultFindReportExt = await Atenciones.find(query)
        .populate({
          path: 'idModPago',
          model: 'Modalidades',
          populate: {
              path: 'servicios',
              model: 'Servicios'
          }
        })
        .populate('idprestdats')
        .populate('idserv')
        .populate('idsubserv')
        .populate('idafildats')
        .populate('idafildats.idperdats')
        .populate('idafildats.idtitdats')
        .populate('idexodats')
        .populate('idexodats.idperdats')
        .populate('idexodats.idperdatsBen')
        .exec(function(err, resultFindReport){
          if(err){
            var respuesta = {
              error: true,
              codigo: 501,
              mensaje: 'Error inesperado',
              respuesta:err
            };
            res.json(respuesta);
            return
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de reporte extraidos con éxito',
              respuesta:resultFindReport
            };
            res.json(respuesta);
            ////Funcion auditora
            prueba.userId=req.body.acceso;
            var control= multiFunct.addAudit(prueba);
            ////
          }
        }); 
        // let arrayQueryFact=[]
        // let objectQuery={}
        // let fecha=new Date(req.body.fechDes);
        // let fecha2=new Date(req.body.fechHast);
        // fecha2.setDate(fecha2.getDate() + 1)

        // if(req.body.idServ!="0000"){
        //   if(req.body.idDoctor!="0000"){
        //     arrayQueryFact.push({servCod:req.body.servCod})
        //     arrayQueryFact.push({cedPrest:req.body.doctorCod})
        //     arrayQueryFact.push({createdAt:{$gte: fecha,$lte: fecha2}})
        //     objectQuery={"$and":arrayQueryFact}
        //   }else{
        //     arrayQueryFact.push({servCod:req.body.servCod})
        //     arrayQueryFact.push({servCod:req.body.servCod})
        //     arrayQueryFact.push({createdAt:{$gte: fecha,$lte: fecha2}})
        //     objectQuery={"$and":arrayQueryFact}
        //   }
        // }else{
        //   if(req.body.idDoctor!="0000"){
        //     arrayQueryFact.push({cedPrest:req.body.doctorCod})
        //     arrayQueryFact.push({cedPrest:req.body.doctorCod})
        //     arrayQueryFact.push({createdAt:{$gte: fecha,$lte: fecha2}})
        //     objectQuery={"$and":arrayQueryFact}
        //     console.log("EL ULTIMO")
        //   }else{
        //     arrayQueryFact.push({createdAt:{$gte: fecha,$lte: fecha2}})
        //     objectQuery={"$and":arrayQueryFact}
        //   }
        // }

        // let resultFindFact = await 
        //   Factura
        //     .aggregate()
        //     .match(objectQuery)
        //     // .project(
        //     //   {
        //     //     numbFact: 1,
        //     //     idservdats:1 ,
        //     //     idprestdats:1 ,
        //     //     cedPrest:1 ,
        //     //     servCod:1 ,
        //     //     payType:1 ,
        //     //     costPac:1 ,
        //     //     status:1 ,
        //     //     pacientes: {
        //     //       "$filter": {
        //     //         "input": "$pacientes",
        //     //         "as": "paciente",
        //     //         "cond": {
        //     //           "$and":[{"$gte":["$$paciente.fechaPer",fecha]},{"$lte":["$$paciente.fechaPer",fecha2]}]
        //     //         }
        //     //       }
        //     //     }
        //     //   }
        //     // )
        //     .exec()
        // await Servicios.populate(resultFindFact, {path: "idservdats"});
        // await Prestadores.populate(resultFindFact, {path: "idprestdats"});
        // await Modalidades.populate(resultFindFact, {path: "idModPago"});
        // await Afiliados.populate(resultFindFact, {path: "idafildats"});
        // await Exonerados.populate(resultFindFact, {path: "idexodats"});
        // await Perdats.populate(resultFindFact, [{path: "idperdats"},{path: "idafildats.idtitdats"},{path: "idexodats.idperdatsBen"},{path: "idexodats.idperdats"}]);
        // var respuesta = {
        //   error: false,
        //   codigo: 200,
        //   mensaje: 'Datos de reporte extraidos con éxito',
        //   respuesta:resultFindReport
        // };
        // res.json(respuesta);
        // ////Funcion auditora
        // prueba.userId=req.body.acceso;
        // var control= await multiFunct.addAudit(prueba);
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
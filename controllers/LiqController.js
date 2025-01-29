'use strict';
var mongoose = require('../models/FacturasModel'),
factura = mongoose.model('Facturas');
var mongoose2 = require('../models/AgendaModel'),
Agenda = mongoose2.model('Agendas');
var mongoose3 = require('../models/ModPagoModel'),
ModPago = mongoose3.model('Modalidades');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.infoDat = function (req, res) {
  var respuesta = {
    error: true,
    codigo: 200,
    mensaje: 'Punto de inicio'
   };
   res.json(respuesta);
};

exports.liquidar = function(req,res){
    liquidarInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica liquidarInt'
    };
    res.json(respuesta);
  });
}
async function liquidarInt (req, res) {
  var prueba={
    process:"Facturar pacientes",
    modulo:"regcont",
    menuItem:21
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
        console.log("valores a liquidar: "+ JSON.stringify(req.body))
        var val=req.body.visto
        // console.log(JSON.stringify(val))
        let {pacientes}=val
        try {
          console.log("codServ: "+val.idservdats.servCod)
          console.log("cedprest: "+val.idprestdats.cedPrest)
              console.log("Inicio")
              let arrFactNew=[]
              let count=0;
              let numbFact=0;
              for await (let paciente of pacientes) {
                if(paciente.confirmCit){
                  let findNumbFact = await factura.find().sort({numbFact: -1}).limit(1).select({numbFact: 1, _id:0}).exec(); //when fail its goes to catch
                  count++
                  console.log("paciente: "+count)
                  // console.log(`NumbFact antes: ${countNumbFact}`)
                  if(findNumbFact.length!=0){
                    numbFact=parseInt(findNumbFact[0].numbFact)+1
                    numbFact= await multiFunct.addCeros(numbFact,5);
                  }else{
                    numbFact=1
                    numbFact= await multiFunct.addCeros(numbFact,5);
                  }
                  // countNumbFact=numbFact
                  // console.log(`NumbFact despues: ${countNumbFact}`)
                  // pacMod= await multiFunct.sortPac(pacientes,numbFact);
                  let findCodModPago = await ModPago.findOne({status:true,cedPrest:val.idprestdats.cedPrest,servCod:val.idservdats.servCod}).select({codModPago: 1,typePag:1,costPac:1}).exec(); //when fail its goes to catch
                  console.log(`Codigo modalidad de Pago: ${findCodModPago}`)
                  const {_id,codModPago,typePag,costPac}=findCodModPago
                  console.log(`Codigo modalidad de Pago _id: ${_id}`)
                  console.log(`_id paciente afiliado/exonerado: ${paciente?.idafildats}`)
                  var data2={
                    numbFact:numbFact,
                    idModPago:_id,
                    cedPrest:val.idprestdats.cedPrest,
                    servCod:val.idservdats.servCod,
                    idperdats:paciente.idperdats._id,
                    idservdats:val.idservdats._id,
                    idprestdats:val.idprestdats._id,
                    idafildats:paciente?.idafildats?paciente?.idafildats?._id:null,
                    idexodats:paciente?.idexodats?paciente?.idexodats?._id:null,
                    pacType:paciente.typePac,
                    pacName:paciente.idperdats.nombre,
                    fechaPer:val.fechaPer,
                  }
                  var newFactura= new factura(data2);
                  console.log("Datos Seteados para Persona: "+JSON.stringify(newFactura))
                  let newFacturaSave = await newFactura.save(); 
                  arrFactNew.push(newFacturaSave)
                  console.log("Datos Guardados: "+JSON.stringify(newFacturaSave))
                  console.log("termina paciente: "+count)
                }
              }
              let updateAgenda = await Agenda.findByIdAndUpdate(val._id,{proceso:"liquidado"},{new:true}).exec()
              console.log("final")
              var respuesta = {
                  error: false,
                  codigo: 200,
                  mensaje: 'Factura creada con éxito',
                  respuesta:arrFactNew
              };
              res.json(respuesta);
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
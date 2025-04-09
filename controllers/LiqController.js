'use strict';
var mongoose = require('../models/AtencionesModel'),
atenc = mongoose.model('Atenciones');
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
    process:"Registrar atenciones diarias de pacientes",
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
        const allData=req.body.visto
        const {pacientes,idprestdats,fechAgen,idModPago,idEspec}=req.body.visto
        console.log('PACIENTES:******'+JSON.stringify(pacientes))
        console.log('idprestdats:******'+JSON.stringify(idprestdats))
        console.log('fechAgen:******'+JSON.stringify(fechAgen))
        console.log('idModPago:******'+JSON.stringify(idModPago))
        console.log('idEspec:******'+JSON.stringify(idEspec))
        console.log("Inicio")
        // var respuesta = {
        //     error: false,
        //     codigo: 200,
        //     mensaje: 'Liquidando',
        //     respuesta:"Liquidando"
        // };
        // res.json(respuesta);
        try {
          // console.log("codServ: "+val.idservdats.servCod)
          // console.log("cedprest: "+val.idprestdats.cedPrest)
              let arrFactNew=[]
              let count=0;
              for await (let paciente of pacientes) {
                if(paciente.confirmCit){
                  count++
                  console.log("paciente: "+count)
                  paciente.servicios.map(async (servicio)=>{
                    console.log("Servicio: "+JSON.stringify(servicio))
                    //buscar en idModPago la modalidad de pago que corresponde al servicio sin consultar la base de datos
                    const findCodModPago = idModPago.find((modalidad) => {
                      // Buscar si algún servicio de esta modalidad coincide con el código de servicio
                      console.log(`Modalidad de pago: ${JSON.stringify(modalidad.servicios)}`);
                      console.log(`Servicio: ${JSON.stringify(servicio.idServ)}`);

                      return modalidad.servicios.some(s => s._id === servicio.idServ._id);
                    });
                    
                    if (!findCodModPago) {
                      console.log(`No se encontró modalidad de pago para el servicio ${servicio.idServ.servCod}`);
                      return;
                    }
                    
                    const {_id, codModPago} = findCodModPago
                    console.log(`Modalidad de pago encontrada: ${codModPago}`);

                    var data2={
                      idModPago:_id,
                      especCod:idEspec.especCod,
                      especialidad:idEspec.especName,
                      cedPrest:idprestdats.cedPrest,
                      idprestdats:idprestdats._id,
                      servCod:servicio.idServ.servCod,
                      subservCod:servicio.idSubServ?servicio.idSubServ.servCod:null,
                      idserv:servicio.idServ._id,
                      idsubserv:servicio.idSubServ?servicio.idServ._id:null,
                      idafildats:paciente?.idafildats?paciente?.idafildats?._id:null,
                      idexodats:paciente?.idexodats?paciente?.idexodats?._id:null,
                      cedPac:paciente.idperdats.cedula,
                      pacType:paciente.typePac,
                      fechAten:allData.fechAgen,
                    }
                    var newFactura= new atenc(data2);
                    console.log("Datos Seteados para ATENCIONES:====== "+JSON.stringify(newFactura))
                    let newFacturaSave = await newFactura.save(); 
                    arrFactNew.push(newFacturaSave)
                    // console.log("Datos Guardados: "+JSON.stringify(newFacturaSave))
                    // console.log("termina paciente: "+count)
                  })
                }
              }
              let updateAgenda = await Agenda.findByIdAndUpdate(allData._id,{proceso:"liquidado"},{new:true}).exec()
              console.log("final")
              var respuesta = {
                  error: false,
                  codigo: 200,
                  mensaje: 'Atenciones agregadas correctamente',
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
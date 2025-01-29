'use strict';
var mongoose = require('../models/MuniModel'),
Muni = mongoose.model('Municipios');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getMuni = function(req,res){
  getMuniInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getMuni'
    };
    res.json(respuesta);
  });
}

async function getMuniInt(req, res) {
  console.log("ENTRO GETMUNI")
  var prueba={
    process:"Consultar Municipios",
    modulo:"config",
    menuItem:6
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
      console.log("BUSQUEDA municipios: "+JSON.stringify(req.body))
      Muni.find({status:true}).sort({Created_date:-1}).exec( async function (err, munidat) {
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
          console.log("BUSQUEDA Municipios: "+JSON.stringify(munidat))
          if(munidat && munidat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran Municipios registrados',
              respuesta:munidat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de los municipios extraidos con exito',
              respuesta:munidat
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

exports.createMuni = function(req,res){
  createMuniInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createMuni'
    };
    res.json(respuesta);
  });
}
async function createMuniInt (req, res) {
  var prueba={
    process:"Registrar Municipio",
    modulo:"config",
    menuItem:6
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
        muniName:val.municipio.toUpperCase()
      }
      var newMuni= new Muni(data);
      console.log("NOSE QUE PASA: "+JSON.stringify(data))
      newMuni.save(async function (err, munidat) {
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
            mensaje: 'Datos del municipio guardados con exito',
            respuesta:munidat
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
exports.createMuniFile = function(req,res){
  createMuniFileInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createMuniFile'
    };
    res.json(respuesta);
  });
}
async function createMuniFileInt (req, res) {
  var prueba={
    process:"Registrar Municipio File",
    modulo:"config",
    menuItem:6
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
          console.log("NOMBRE FORMATEADO: "+val[cont].muniName)
          val[cont].muniName=val[cont].muniName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
          console.log("NOMBRE FORMATEADO: "+val[cont].muniName)
          var newMuni= new Muni(val[cont]);
          const result2 = await Muni.findOne({muniName:val[cont].muniName}).exec();
          console.log("Resultado: "+result2)
          if(!result2){
            console.log("Se registra")
            try {
              let saveUser = await newMuni.save(); //when fail its goes to catch
              // cont++
              console.log("Dentro: "+cont+" - "+count)
              if(cont==count-1){
                console.log("FIN....................")
                res.json({error:false,codigo:200,mensaje:"Carga de datos terminada",respuesta:[]})
              }
            } catch (err) {
              console.log('err' + err);
              // cont++
              console.log("Dentro: "+cont+" - "+count)
              if(cont==count-1){
                console.log("FIN....................")
                res.json({error:false,codigo:200,mensaje:"Carga de datos terminada",respuesta:[]})
              }
            }
          }else{
            console.log("No se registra")
            // cont++
            console.log("Dentro2: "+cont+" - "+count)
            if(cont==count-1){
              console.log("FIN....................")
              res.json({error:false,codigo:200,mensaje:"Carga de datos terminada",respuesta:[]})
            }
          }
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

exports.deleteMuni = function(req,res){
  deleteMuniInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteMuni'
    };
    res.json(respuesta);
  });
}
async function deleteMuniInt (req, res) {
  var prueba={
    process:"Eliminar Municipio",
    modulo:"config",
    menuItem:12
  }
  if(req.body.acceso && req.params.muniId){
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
      Muni.remove({ _id: req.params.muniId}, async function (err, searchMuni) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log("BORRADO: "+searchMuni)
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos del municipio eliminados con éxito',
              respuesta:searchMuni
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
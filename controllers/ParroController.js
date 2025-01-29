'use strict';
var mongoose = require('../models/ParroModel'),
Parro = mongoose.model('Parroquias');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getParro = function(req,res){
  getParroInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getParro'
    };
    res.json(respuesta);
  });
}

async function getParroInt(req, res) {
  console.log("ENTRO getParro")
  var prueba={
    process:"Consultar Parroquias",
    modulo:"config",
    menuItem:7
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
      console.log("BUSQUEDA parroquias: "+JSON.stringify(req.body))
      Parro.find({status:true}).sort({Created_date:-1}).exec( async function (err, parrodat) {
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
          console.log("BUSQUEDA parroquias: "+JSON.stringify(parrodat))
          if(parrodat && parrodat.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran Parroquias registradas',
              respuesta:parrodat
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de las parroquias extraidos con exito',
              respuesta:parrodat
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

exports.createParro = function(req,res){
  createParroInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createParro'
    };
    res.json(respuesta);
  });
}
async function createParroInt (req, res) {
  var prueba={
    process:"Registrar Parroquia",
    modulo:"config",
    menuItem:7
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
        parroName:val.parroquia.toUpperCase()
      }
      var newParro= new Parro(data);
      console.log("NOSE QUE PASA: "+JSON.stringify(data))
      newParro.save(async function (err, parrodat) {
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
            mensaje: 'Datos de la parroquia guardados con exito',
            respuesta:parrodat
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
exports.createParroFile = function(req,res){
  createParroFileInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createParroFile'
    };
    res.json(respuesta);
  });
}
async function createParroFileInt (req, res) {
  var prueba={
    process:"Registrar Parroquia File",
    modulo:"config",
    menuItem:7
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
          element.parroName=element.parroName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
          console.log("NOMBRE FORMATEADO: "+element.parroName)
          var newParro= new Parro(element);
          const result2 = await Parro.findOne({parroName:element.parroName}).exec();
          console.log("Resultado: "+result2)
          if(!result2){
            console.log("Se registra")
            try {
              let saveUser = await newParro.save(); //when fail its goes to catch
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

exports.deleteParro = function(req,res){
  deleteParroInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteParro'
    };
    res.json(respuesta);
  });
}
async function deleteParroInt (req, res) {
  var prueba={
    process:"Eliminar Parroquia",
    modulo:"config",
    menuItem:12
  }
  if(req.body.acceso && req.params.parroId){
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
      Parro.remove({ _id: req.params.parroId}, async function (err, searchParro) {
        if (err){
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'Error inesperado',
            respuesta:err
          };
          res.json(respuesta);
        }else{
          console.log("BORRADO: "+searchParro)
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de la parroquia eliminados con éxito',
              respuesta:searchParro
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
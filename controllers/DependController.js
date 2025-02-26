'use strict';
var mongoose = require('../models/DependModel'),
Depend = mongoose.model('Dependencias');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo

exports.getDepend = function(req,res){
  getDependInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getDepend'
    };
    res.json(respuesta);
  });
}

async function getDependInt(req, res) {
  console.log("ENTRO getDepend")
  var prueba={
    process:"Consultar Dependencias",
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
      return
    }
    let resultFindDepend = await Depend.find().exec();
    var respuesta = {
        error: false,
        codigo: 200,
        mensaje: 'Datos de las dependencias extraidos con éxito',
        respuesta:resultFindDepend
    };
    res.json(respuesta);
    ////Funcion auditora
    console.log("aqui")
    prueba.userId=req.body.acceso;
    var control= await multiFunct.addAudit(prueba);
    //// 
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

exports.createDepend = function(req,res){
  createDependInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createDepend'
    };
    res.json(respuesta);
  });
}
async function createDependInt (req, res) {
  var prueba={
    process:"Registrar Dependencia",
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
        let dependCod;
        let dependName=val.dependencia.toUpperCase()
        let resultFindDepend = await Depend.findOne({dependName:dependName}).exec();
        if(resultFindDepend?.length==0){
            var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'La dependencia ya se encuentra registrada..',
                respuesta:newDependSave
            };
        }
        
        let resultDependCod = await Depend.find().sort({dependCod: -1}).limit(1).select({dependCod: 1, _id:0}).exec();
        if(resultDependCod?.length!=0){
            dependCod=parseInt(resultDependCod[0]?.dependCod)+1
            dependCod= await multiFunct.addCeros(dependCod,5);
        }else{
            dependCod=1
            dependCod= await multiFunct.addCeros(dependCod,5);
        }
        
        var data={
            dependCod:dependCod,
            dependName:dependName
        }
        var newDepend= new Depend(data);
        let newDependSave = await newDepend.save();
        var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Datos de la dependencia guardados con éxito',
            respuesta:newDependSave
        };
        res.json(respuesta);
        ////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
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

exports.deleteDepend = function(req,res){
  deleteDependInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteDepend'
    };
    res.json(respuesta);
  });
}
async function deleteDependInt (req, res) {
    var prueba={
        process:"Eliminar Parroquia",
        modulo:"config",
        menuItem:12
    }
    if(req.body.acceso && req.params.dependId){
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
            try {
                const resultDelete = await Depend.findByIdAndDelete(req.params.dependId);
                var respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Datos de la dependencia eliminados con éxito',
                    respuesta:resultDelete
                };
                res.json(respuesta);
                ////Funcion auditora
                prueba.userId=req.body.acceso;
                var control= await multiFunct.addAudit(prueba);
                console.log("registrado")
                ////
            } catch(err) {
                console.log(err)
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
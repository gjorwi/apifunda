'use strict';
var mongoose = require('../models/PerdatModel'),
Perdat = mongoose.model('Perdats');
var mongoose2 = require('../models/SolAfiliadoModel'),
SolAfil = mongoose2.model('SolAfiliados');
var mongoose3 = require('../models/AfiliadoModel'),
Afil = mongoose2.model('Afiliados');
var multiFunct = require('../functions/exterFunct');//multiFunc llamaddo
const XLSX = require('xlsx');

exports.infoDat = function (req, res) {
  var respuesta = {
    error: true,
    codigo: 200,
    mensaje: 'Punto de inicio'
   };
   res.json(respuesta);
};

exports.getSolAfil = function(req,res){
  getSolAfilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica getSolAfil'
    };
    res.json(respuesta);
  });
}

async function getSolAfilInt(req, res) {
  var prueba={
    process:"Consultar Solicitud Afiliado",
    modulo:"recepcion",
    menuItem:10
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
      SolAfil.
        find({status:true}).
        populate('idperdats').
        exec(async function (err, solAfidats) {
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
          if(solAfidats && solAfidats.length==0){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'No se encuentran afiliados registradas',
              respuesta:solAfidats
            };
            res.json(respuesta);
          }else{
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Datos de afiliados extraidos con exito',
              respuesta:solAfidats
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

exports.readSolAfilXlsx = function(req,res){
  readSolAfilXlsxInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readSolAfilXlsx'
    };
    res.json(respuesta);
  });
}

async function readSolAfilXlsxInt(req, res) {
  var prueba={
    process:"Consultar afiliado xlsx",
    modulo:"recepcion",
    menuItem:10
  }
  if(req.body.acceso){
    var control=true
    if(!control){
      var respuesta = {
        error: true,
        codigo: 501,
        mensaje: 'No tiene acceso'
      };
      res.json(respuesta);
    }
    else{
      try {
        // //consultar los municipios y las parroquias
        // const municipios = await Municipio.find({status:true});
        // const parroquias = await Parroquia.find({status:true});
        
        // Leer el archivo Excel desde la ruta proporcionada
        console.log("Leyendo archivo excel");
        const workbook = XLSX.readFile('excelData.xlsx');
        console.log("Archivo leido");
        // Obtener la primera hoja
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        console.log("Hoja obtenida");
        // Convertir a JSON manteniendo los encabezados
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          raw: false,
          defval: '',
          header: 1
        });
        console.log("Datos convertidos");
        if (jsonData.length < 2) {
          return res.json({
            error: true,
            codigo: 400,
            mensaje: 'El archivo no contiene datos suficientes'
          });
        }

        // Extraer encabezados (primera fila)
        const headers = jsonData[0];
        console.log("Encabezados extraidos");
        // Procesar datos (resto de filas)
        const data = jsonData.slice(1).map(row => {
          const item = {};
          headers.forEach((header, index) => {
            const cleanHeader = header.trim().toLowerCase().replace(/\s+/g, '_');
            item[cleanHeader] = row[index] || '';
          });
          return item;
        });
        data.map(async (row, index) => {
          // Aquí puedes agregar las validaciones específicas que necesites
          // Por ejemplo, validar cédulas, fechas, etc.
          const formattedRow = { ...row };
  
          // Ejemplo de validaciones (ajustar según tus necesidades)
          if (formattedRow.cedula) {
            formattedRow.cedula = formattedRow.cedula.toString().trim();
            // Validar cédula quitar ceros adelante
            formattedRow.cedula = formattedRow.cedula.replace(/^0+/, '');
          }
          if (formattedRow.fecha_nacimiento) {
              // Convertir fecha a formato ISO
              const fecha = new Date(formattedRow.fecha_nacimiento);
              formattedRow.fecha_nacimiento = fecha.toISOString().split('T')[0];
          }
          if (formattedRow.nombre) {
              formattedRow.nombre = formattedRow.nombre.toString().trim().toUpperCase();
          }
          if (formattedRow.apellido) {
              formattedRow.apellido = formattedRow.apellido.toString().trim().toUpperCase();
          }
          if (formattedRow.sexo) {
              formattedRow.sexo = formattedRow.sexo==="M"?"MASCULINO":"FEMENINO";
          }
          if (formattedRow.estciv) {
              formattedRow.estciv = formattedRow.estciv==="S"?"SOLTERO":formattedRow.estciv==="C"?"CASADO":formattedRow.estciv==="D"?"DIVORCIADO":formattedRow.estciv==="V"?"VIUDO":"";
          }
          data[index] = formattedRow;
        });
        //guardar datos en base de datos uno por uno utilizando el modelo afiliadoModel
        var count=0; 
        for await (const row of data) {
          count++;
          console.log("Contador: "+count);
          //validar que solo el campo birthday no este vacio y que no contenga caracteres tipo guiones
          if(count>790){
            console.log("Datos procesados");
            console.log("+++++++++++Datos procesados antes de guardar+++++: ",JSON.stringify(data[0]));
            //crear una variable modelo con los datos a guardar en el esquema de afiliado
            const dataAfil = {
              nombre: row.nombre,
              apellido: row.apellido,
              cedula: row.cedula,
              sexo: row.sexo,
              estCiv: row.estciv,
              telefono: row.telefono,
              correo: row.correo,
              direccion: row.direccion,
              muni: row.muni,
              parro: row.parro,
              sect: row.sect,
              birthday: row.birthday ? (row.birthday.includes('-') ? null : row.birthday) : null,
              status: true,
              human: true
            };
            
            const afiliado = new Perdat(dataAfil);
            console.log("datos de persona: ",JSON.stringify(afiliado));
            const resultFind = await Perdat.findOne({ cedula: row.cedula });
            let idperdats;
            if (!resultFind) {
              const result = await afiliado.save();
              idperdats = result._id;
              console.log("Datos de persona guardados: ",JSON.stringify(result));
            }else{
              idperdats = resultFind._id;
            }
            //formatear fecha para ingresarla correctamente a la base de datos dd-MM-yyyy
            const formatearFecha = (fecha) => {
              if (!fecha) return new Date();
              const fechaObj = new Date(fecha);
              if (isNaN(fechaObj.getTime())) return new Date();
              return fechaObj;
            };

            var data2={
              afilId:row.cedula,
              idperdats:idperdats,
              depend:row.depend,
              nomi:row.nomi,
              depart:row.depart,
              type:'TITULAR',
              cedpad:'NA',
              cedmad:'NA',
              cedtit:row.cedula,
              idtitdats:idperdats,
              parent:'NA',
              fechinglab:row.fechinglab,
              reqdocanex:{
                actMat:false,
                cedEsp:false,
                disMat:false,
                actDef:false,
                autRet:false,
                partNacHij:false,
                cedHij9A:false,
                constEst:false,
                cartSolt:false,
                cartDepEco:false,
                carDisc:false,
                certPartNac:false,
                cedPadres:false
              } ,
              docanex:{
                docced:true,
                docnomb:true,
                docrecpag:true
              },
              obs:'',
              status:row.status=="ACTIVO"?true:false,
              Updated_date:formatearFecha(row.fechaactdats)
            }
            console.log("Datos de antes del esquema afiliado: ",JSON.stringify(data2));
            const afiliado2 = new Afil(data2);
            console.log("Datos de afiliado: ",JSON.stringify(afiliado2));
            const resultFind2 = await Afil.findOne({ afilId: row.cedula });
            if (!resultFind2) {
              const result2 = await afiliado2.save();
              console.log("Datos de afiliado guardados: ",JSON.stringify(result2));
            }
          }
          
        }
        
        // Enviar respuesta
        res.json({
          error: false,
          codigo: 200,
          mensaje: 'Archivo procesado correctamente',
          respuesta: {
            headers: headers,
            data: data,
            totalRows: data.length
          }
        });
        console.log("Respuesta enviada");
      } catch (error) {
        console.error('Error procesando archivo:', error);
        res.json({
          error: true,
          codigo: 500,
          mensaje: 'Error procesando el archivo: ' + error.message
        });
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
}

exports.createSolAfil = function(req,res){
  createSolAfilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica createSolAfil'
    };
    res.json(respuesta);
  });
}
async function createSolAfilInt (req, res) {
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
        
        try {
          let resultSol= await SolAfil.findOne({afilId:val.afiCed,status:true}).exec()
          if(resultSol){
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'Ya existe una solicitud registrada.',
              respuesta:[]
            };
            res.json(respuesta);
            return
          }
          var departMod;
          if(val.depart){
            departMod = val.depart
          }else{
            departMod='NA'
          }
            var data2={
                afilId:val.afiCed,
                cedula:val.afiCed,
                nombre:val.afiName,
                apellido:val.afiLast,
                sexo:val.afiSex,
                estCiv:val.afiEstCiv,
                birthday:val.afiBday,
                telefono:val.afiCell,
                muni:val.afiMuni,
                parro:val.afiParro,
                sect:val.afiSect,
                correo:val.afiEmail,
                direccion:val.afiAddress,
                human:true,
                depend:val.depend,
                nomi:val.nomi,
                depart:departMod,
                type:val.type,
                cedpad:val.cedPad,
                cedmad:val.cedMad,
                cedtit:val.cedTit,
                parent:val.parent,
                verifyMayores:val.verifyMayores,
                fechinglab:val.fechIngLab,
                reqdocanex:val.reqDocAnex,
                docanex:val.afiDocAnex,
                obs:val.obs,
                condicion:val.condicion=="true"?true:false
            }

            console.log("Datos Arreglados para afiliado: "+JSON.stringify(data2))
            var newSolAfil = new SolAfil(data2);
            let saveSolAfil = await newSolAfil.save(); //when fail its goes to catch
            var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Datos de solicitud guardados con exito',
                respuesta:saveSolAfil
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

exports.readSolAfil = function(req,res){
  readSolAfilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica readSolAfil'
    };
    res.json(respuesta);
  });
}

async function readSolAfilInt (req, res) {
  var prueba={
    process:"Consultar Afiliado",
    modulo:"recepcion",
    menuItem:8
  }
  console.log("DATA: "+JSON.stringify(req.body))
  if(req.body.acceso && req.params.solAfilId){
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
      SolAfil.
      findOne({afilId:req.params.solAfilId,status:true}).
      populate('idperdats').
      exec(async function (err, afildat) {
          if (err){
              var respuesta = {
                  error: true,
                  codigo: 501,
                  mensaje: 'Error inesperado',
                  respuesta:err
              };
              res.json(respuesta);
          }else{
            console.log("DATA AFILIADO: "+JSON.stringify(afildat))
            if(afildat==null){
              if(perdat==null){
                var respuesta = {
                  error: false,
                  codigo: 200,
                  mensaje: 'No se encuentra afiliado',
                  respuesta:afildat
                };
                res.json(respuesta);
              }
            }else{
              var respuesta = {
                  error: false,
                  codigo: 200,
                  mensaje: 'Datos de afiliado extraidos con exito',
                  respuesta:afildat
              };
              res.json(respuesta);
            }
            ////Funcion auditora
            prueba.userId=req.body.acceso;
            prueba.modulo=req.body.moduloId;
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

exports.updateSolAfil = function(req,res){
  updateSolAfilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica updateSolAfil' 
    };
    res.json(respuesta);
  });
}

async function updateSolAfilInt (req, res) {
  var prueba={
    process:"Aprobar Solicitud",
    modulo:"regcont",
    menuItem:17
  }
  if(req.body.acceso && req.body.respaprob && req.params.solAfilId){
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
        var _id;
        console.log("AQUI")
        let resultFindSolAfil = await SolAfil.findOne({ afilId: req.params.solAfilId,status:true,$or:[{proceso:"aprobado"},{proceso:"rechazado"}]}).exec()
        console.log("RESULT FIND SOLAFIL: "+resultFindSolAfil)
        if(!resultFindSolAfil){
          if(req.body.typeAprob==true){
            console.log("AFIL ID O CEDULA: "+req.params.solAfilId)
            let resultFindPer = await Perdat.findOne({ cedula: req.params.solAfilId,human:true}).exec()
            console.log("RESULT FIND perdat: "+resultFindPer)
            var mensaje;
            var resultFind;
            resultFind = await SolAfil.findOneAndUpdate({ afilId: req.params.solAfilId,status:true,proceso: "pendiente"},{proceso:"aprobado",respaprob:req.body.respaprob},{new:true}).exec()
            console.log('DATOS QUE NO ENTIENDO:++++'+JSON.stringify(resultFind))
            if(!resultFindPer){
              var data={
                cedula:resultFind.cedula,
                nombre:resultFind.nombre,
                apellido:resultFind.apellido,
                sexo:resultFind.sexo,
                birthday:resultFind.birthday,
                estCiv:resultFind.estCiv,
                telefono:resultFind.telefono,
                muni:resultFind.muni,
                parro:resultFind.parro,
                sect:resultFind.sect,
                correo:resultFind.correo,
                direccion:resultFind.direccion,
                human:true
              }
              // let resultFind = await SolAfil.findOne({ afilId: req.params.solAfilId,status:true,proceso: "pendiente"}).exec()
              console.log("RESULT FIND TRUE "+resultFind.afilId)
              console.log("ANTES DE GUARDAR: "+JSON.stringify(data))
              var newPerdat = new Perdat(data);
              console.log("RESULT ARREGLO PERDAT"+JSON.stringify(newPerdat))
              var resultSavePer = await newPerdat.save()
              _id=resultSavePer._id
              mensaje=false
            }else{
              if(resultFindPer.status==false){
                mensaje=true
              }else{
                console.log("Direccion======:"+JSON.stringify(resultFind.direccion))
                var data={
                  nombre:resultFind.nombre,
                  apellido:resultFind.apellido,
                  sexo:resultFind.sexo,
                  birthday:resultFind.birthday,
                  estCiv:resultFind.estCiv,
                  telefono:resultFind.telefono,
                  muni:resultFind.muni,
                  parro:resultFind.parro,
                  sect:resultFind.sect,
                  correo:resultFind.correo,
                  direccion:resultFind.direccion,
                  human:true
                }
                // let resultFindPer = await Perdat.findOne({ cedula: req.params.solAfilId,human:true}).exec()
                const result = await Perdat.updateOne(
                  { cedula: req.params.solAfilId,human:true},
                  { $set: data }
                );
                console.log("RESULT UPDATE PERDAT "+JSON.stringify(result))
                mensaje=false
              }
              _id=resultFindPer._id
            }
            console.log("Punto critico")
            if(mensaje){
              console.log("Punto critico, si hay mensaje")
              var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'La persona se encuentra registrada pero esta deshabilitada, debe habilitarla.',
                respuesta:[]
              };
              res.json(respuesta);
            }else{
              console.log("Punto critico, no hay mensaje")
              console.log("ID: "+req.params.solAfilId)
              let resultFindAfiliado = await Afil.findOne({ afilId: req.params.solAfilId,status:true}).exec()
              let resultFindAfiliado2 = await Afil.find({ afilId: req.params.solAfilId,status:true}).exec()
              console.log("RESULT FIND Afiliado "+resultFindAfiliado)
              console.log("RESULT FIND Afiliado2 "+resultFindAfiliado2)
              console.log("llego aqui: "+JSON.stringify(resultFind))
              resultFind.idperdats=_id
              let resultFindPerdats = await Perdat.findOne({ cedula: resultFind.cedtit}).exec()
              
              if(resultFindAfiliado){
                console.log('+++++Datos ANTES DEL UPDATE AFILIADO:+++'+JSON.stringify(data2))
                console.log("ID: "+req.params.solAfilId)
                let resultFindAfiliadoUpdate = await Afil.findOne({ afilId: req.params.solAfilId}).exec()
                console.log(JSON.stringify(resultFindAfiliadoUpdate))
                resultFindAfiliadoUpdate.depend=resultFind.depend
                resultFindAfiliadoUpdate.nomi=resultFind.nomi
                resultFindAfiliadoUpdate.depart=resultFind.depart
                resultFindAfiliadoUpdate.type=resultFind.type
                resultFindAfiliadoUpdate.cedpad=resultFind.cedpad
                resultFindAfiliadoUpdate.cedmad=resultFind.cedmad
                resultFindAfiliadoUpdate.cedtit=resultFind.cedtit
                resultFindAfiliadoUpdate.condicion=resultFind.condicion
                resultFindAfiliadoUpdate.idtitdats=resultFindPerdats._id
                resultFindAfiliadoUpdate.parent=resultFind.parent
                resultFindAfiliadoUpdate.verifyMayores=resultFind.verifyMayores
                resultFindAfiliadoUpdate.fechinglab=resultFind.fechinglab
                resultFindAfiliadoUpdate.reqdocanex=resultFind.reqdocanex
                resultFindAfiliadoUpdate.docanex=resultFind.docanex
                resultFindAfiliadoUpdate.obs=resultFind.obs
                resultFindAfiliadoUpdate.Updated_date=new Date()
                const result=await resultFindAfiliadoUpdate.save()
                // const result = await Afil.findOneAndUpdate(
                //   { afilId: req.params.solAfilId,human:true},
                //   { $set: data2 },
                //   { new: true }
                // );
                // console.log('+++++Datos del UPDATE AFILIADO:+++'+JSON.stringify(result))
                console.log('+++++Datos del UPDATE AFILIADO:+++'+JSON.stringify(result))
              }else{
                var data2={
                  afilId:resultFind.afilId,
                  idperdats:resultFind.idperdats,
                  depend:resultFind.depend,
                  nomi:resultFind.nomi,
                  depart:resultFind.depart,
                  type:resultFind.type,
                  cedpad:resultFind.cedpad,
                  cedmad:resultFind.cedmad,
                  cedtit:resultFind.cedtit,
                  idtitdats:resultFindPerdats._id,
                  parent:resultFind.parent,
                  verifyMayores:resultFind.verifyMayores,
                  condicion:resultFind.condicion,
                  fechinglab:resultFind.fechinglab,
                  reqdocanex:resultFind.reqdocanex,
                  docanex:resultFind.docanex,
                  obs:resultFind.obs,
                  Updated_date:new Date()
                }
                var newAfil = new Afil(data2);
                console.log("RESULT ARREGLO afil"+JSON.stringify(newAfil))
                let resultSaveAfil = await newAfil.save()
              }
              var respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'La solicitud fue aprobada',
                // respuesta:{datsPer:resultSavePer,datsAfil:resultSaveAfil}
                respuesta:[]
              };
              res.json(respuesta);
              // }
            }
          }else if(req.body.typeAprob==false){
            let resultFind = await SolAfil.findOneAndUpdate({ afilId: req.params.solAfilId,status:true,proceso: "pendiente"},{proceso:"rechazado",respaprob:req.body.respaprob},{new:true}).exec()
            var respuesta = {
              error: false,
              codigo: 200,
              mensaje: 'La solicitud fue rechazada',
              respuesta:resultFind
            };
            res.json(respuesta);
          }
        }else{
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'La solicitud ya fue revisada',
            respuesta:[]
          };
          res.json(respuesta);
        }
        
        ////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
        ////
      }catch(err){
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
exports.deleteSolAfil = function(req,res){
  deleteSolAfilInt(req,res)
  .catch(e => {
    console.log('Problemas en el servidor ****: ' + e.message);
    var respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'Problemas Internos, Contacte con el departamento de informatica deleteSolAfil'
    };
    res.json(respuesta);
  });
}
async function deleteSolAfilInt (req, res) {
  var prueba={
    process:"Eliminar Solicitud Afiliación",
    modulo:"recepcion",
    menuItem:14
  }
  if(req.body.acceso && req.params.solAfilId){
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
        console.log(req.params.solAfilId)
        let resultFind = await SolAfil.findOneAndUpdate({ _id: req.params.solAfilId,status:true,$or:[{ proceso: "aprobado" }, { proceso: "rechazado" }]},{status:false},{new:true}).exec()
        console.log("RESPUESTA UPDATEDELETE: "+JSON.stringify(resultFind))
        if(resultFind!=null){
          var respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Solicitud afiliado vista',
            respuesta:resultFind
          };
          res.json(respuesta);
        }else{
          var respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'No es posible dar por vista la solicitud, antes debe ser Revisada',
            respuesta:resultFind
          };
          res.json(respuesta);
        }
        
        //////Funcion auditora
        prueba.userId=req.body.acceso;
        var control= await multiFunct.addAudit(prueba);
        console.log("registrado")
        ////
      }catch(err){
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
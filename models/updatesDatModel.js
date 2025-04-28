'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UpdatesDatSchema = new Schema({
  afilId: {
    type: String,
    required: [true, 'Id de afiliado']
  },
  idAfilDats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Afiliados',
    required: [true, 'Id de datos de afiliado']
  },
  excentAprob: {
    type: Boolean,
    default:false
  },
  docanex: {
    docced: {
        type: Boolean,
        default: false
    },
    docnomb: {
        type: Boolean,
        default: false
    },
    docrecpag: {
        type: Boolean,
        default: false
    }
  },
  updateDescription: {
    type: String,
    default: ""
  },
  reqdocanex: {
      actMat:{
          type: String,
          default: "false"
      },
      cedEsp:{
          type: String,
          default: "false"
      },
      disMat:{
          type: String,
          default: "false"
      },
      partNacHij:{
          type: String,
          default: "false"
      },
      cedHij9A:{
          type: String,
          default: "false"
      },
      constEst:{
          type: String,
          default: "false"
      },
      cartSolt:{
          type: String,
          default: "false"
      },
      cartDepEco:{
          type: String,
          default: "false"
      },
      carDisc:{
          type: String,
          default: "false"
      },
      certPartNac:{
          type: String,
          default: "false"
      },
      cedPadres:{
          type: String,
          default: "false"
      },
      actDef:{
          type: String,
          default: "false"
      },
      autRet:{
          type: String,
          default: "false"
      },
  },
  idUserDatsCreate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    default:null
  },
  idUserDatsUpdate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users', 
    default:null
  },
  proceso: {
    type: String,
    default:"pendiente"
  },
  respaprob: {
    type: String,
    default:"En espera de revisión"
  },
  status: {
    type: Boolean,
    default:true
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  Updated_date: {
    type: Date,
    default:""
  },
});
module.exports = mongoose.model('UpdatesDats', UpdatesDatSchema);
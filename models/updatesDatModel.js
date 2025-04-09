'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UpdatesDatSchema = new Schema({
  idAfilDats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Afiliados',
    required: [true, 'Id de datos de afiliado']
  },
  excentAprob: {
    type: Boolean,
    default:false
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
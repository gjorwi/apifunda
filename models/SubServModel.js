'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SubServSchema = new Schema({
  servName: {
    type: String,
    required: [true, 'Nombre del Sub-Servicio']
  },
  servCod: {
    type: String,
    required: [true, 'Codigo del Sub-Servicio'],
    unique:true
  },
  idServ: {
    type: mongoose.Schema.ObjectId,
    ref: 'Servicios'
  },
  excentAprob: {
    type: Boolean,
    default:false
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
module.exports = mongoose.model('Subservicios', SubServSchema);
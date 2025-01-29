'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ServSchema = new Schema({
  servName: {
    type: String,
    required: [true, 'Nombre del Servicio']
  },
  servCod: {
    type: String,
    required: [true, 'Codigo del Servicio'],
    unique:true
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
module.exports = mongoose.model('Servicios', ServSchema);
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EspecialidadSchema = new Schema({
  especName: {
    type: String,
    required: [true, 'Nombre del Sub-Servicio']
  },
  especCod: {
    type: String,
    required: [true, 'Codigo del Sub-Servicio'],
    unique:true
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
module.exports = mongoose.model('Especialidades', EspecialidadSchema);
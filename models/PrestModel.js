'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PrestSchema = new Schema({
  prestName: {
    type: String,
    required: [true, 'Nombre del Prestador']
  },
  cedPrest: {
    type: String,
    required: [true, 'Cedula del prestador']
  },
  telPrest: {
    type: String,
    required: [true, 'Telefono del prestador']
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
module.exports = mongoose.model('Prestadores', PrestSchema);
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NominaSchema = new Schema({
  nominaCod: {
    type: String,
    required: [true, 'Id de la nomina'],
    unique:true
  },
  nominaName: {
    type: String,
    required: [true, 'Nombre de la nomina'],
    unique:true
  },
  status: {
    type: Boolean,
    default:true
  },
},{ timestamps: true });
module.exports = mongoose.model('Nominas', NominaSchema);
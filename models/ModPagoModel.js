'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ModPagoSchema = new Schema({
  codModPago: {
    type: String,
    required: [true, 'Codigo de modalidad de pago']
  },
  cedPrest: {
    type: String,
    required: [true, 'Cedula del Prestador']
  },
  idpresdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prestadores'
  },
  idservdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Servicios'
  },
  servCod: {
    type: String,
    required: [true, 'Nombre del servicio']
  },
  typePag: {
    type: String,
    required: [true, 'Tipo de pago']
  },
  cantPac: {
    type: Number,
    required: [true, 'Cantidad de pacientes']
  },
  costPac: {
    type: Number,
    required: [true, 'Costo de servicio']
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
module.exports = mongoose.model('Modalidades', ModPagoSchema);
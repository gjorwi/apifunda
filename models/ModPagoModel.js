'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ModPagoSchema = new Schema({
  codModPago: {
    type: String,
    required: [true, 'Codigo de modalidad de pago']
  },
  idpresdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prestadores'
  },
  idEspec: {
    type: mongoose.Schema.ObjectId,
    ref: 'Especialidades'
  },
  servicios: [{ type: Schema.Types.ObjectId, ref: 'Servicios', required: true }],
  especialidad: {
    type: String,
    required: [true, 'Tipo de pago']
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
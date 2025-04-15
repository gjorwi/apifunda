'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AtencionesSchema = new Schema({
  idModPago: {
    type: mongoose.Schema.ObjectId,
    ref: 'Modalidades',
    required: [true, 'ID de la modalidad de pago']
  },
  especCod: {
    type: String,
    required: [true, 'Codigo de la especialidad']
  },
  especialidad: {
    type: String,
    required: [true, 'Especialidad del prestador']
  },
  cedPrest: {
    type: String,
    required: [true, 'Cedula del prestador']
  },
  idprestdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prestadores',
    required: [true, 'ID del prestador']
  },
  servCod: {
    type: String,
    required: [true, 'Codigo de servicio']
  },
  subservCod: {
    type: String,
    default:null
  },
  idserv: {
    type: mongoose.Schema.ObjectId,
    ref: 'Servicios',
    required: [true, 'ID de Servicios']
  },
  idsubserv: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subservicios',
    default:null
  },
  cedPac:{
    type: String,
    required: [true, 'Cedula del paciente']
  },
  pacType:{
    type: String,
    required: [true, 'tipo de paciente']
  },
  idafildats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Afiliados',
    default:null
  },
  idexodats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Exonerados',
    default:null
  },
  fechAten: {
    type: String,
    required: [true, 'Fecha de la atencion']
  },
  idUserDatsCreate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    default:null
},
  status: {
    type: Boolean,
    default:true
  }
},{ timestamps: true });

module.exports = mongoose.model('Atenciones', AtencionesSchema);
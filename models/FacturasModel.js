'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FacturasSchema = new Schema({
  numbFact: {
    type: String,
    required: [true, 'Numero de factura']
  },
  idModPago: {
    type: mongoose.Schema.ObjectId,
    ref: 'Modalidades',
    required: [true, 'ID de la modalidad de pago']
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
  idservdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Servicios',
    required: [true, 'ID de Servicios']
  },
  idperdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Perdats'
  },
  pacName:{
    type: String,
    required: [true, 'nombre paciente']
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
    ref: 'EXONERADOS',
    default:null
  },
  fechaPer: {
    type: String,
    required: [true, 'Fecha personalizada']
  },
  servCod:{
    type: String,
    required: [true, 'Codigo de servicio']
  },
  status: {
    type: Boolean,
    default:true
  }
},{ timestamps: true });

module.exports = mongoose.model('Facturas', FacturasSchema);
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AgendaSchema = new Schema({
  fechAgen: {
    type: String,
    required: [true, 'Nombre del Prestador']
  },
  idservdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Servicios'
  },
  idprestdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prestadores'
  },
  countPac: {
    type: Number,
    required: [true, 'Cedula del prestador']
  },
  fechaPer: {
    type: String,
    required: [true, 'Fecha personalizada']
  },
  pacientes: [{
    confirmCit:{
      type: Boolean,
      default:false
    },
    typePac: {
      type: String,
      required: [true, 'Tipo de paciente EXO o AFIL']
    },
    idperdats: {
      type: mongoose.Schema.ObjectId,
      ref: 'Perdats',
      required: [true, 'Id datos de personas']
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
    }
  }],
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
module.exports = mongoose.model('Agendas', AgendaSchema);
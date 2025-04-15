'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AgendaSchema = new Schema({
  fechAgen: {
    type: String,
    required: [true, 'Fecha de la agenda']
  },
  idprestdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prestadores'
  },
  idEspec: {
    type: mongoose.Schema.ObjectId,
    ref: 'Especialidades'
  },
  idModPago: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Modalidades'
  }],
  countPac: {
    type: Number,
    required: [true, 'Cantidad de pacientes']
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
    },
    servicios: [{
      idServ:{
        type: mongoose.Schema.ObjectId,
        ref: 'Servicios',
        required: [true, 'Id datos de personas'],
        default:null
      },
      idSubServ:{
        type: mongoose.Schema.ObjectId,
        ref: 'Subservicios',
        required: [true, 'Id datos de personas'],
        default:null
      }
    }],
  }],
  proceso: {
    type: String,
    default:"pendiente"
  },
  status: {
    type: Boolean,
    default:true
  },
  idUserDatsCreate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    default:null
  },
  idUserDatsTerminated: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    default:null
  },
  idUserDatsLiquido: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    default:null
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
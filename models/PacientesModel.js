'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PacientesSchema = new Schema({
    idperdats: {
        type: mongoose.Schema.ObjectId,
        ref: 'Perdats'
    },
    status:{
        type: Boolean,
        default:false
    },
    idafildats: {
      type: mongoose.Schema.ObjectId,
      ref: 'Afiliados',
      required: [true, 'Identificador de afiliado']
    },
    fechaPer: {
        type: Date,
        required: [true, 'Fecha personalizada']
    },
    numbFact: {
        type: String,
        required: [true, 'Numero de factura']
    }
},{ timestamps: true });

module.exports = mongoose.model('Pacientes', PacientesSchema);
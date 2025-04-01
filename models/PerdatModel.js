'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PerdatSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'Nombre de la persona']
  },
  apellido: {
    type: String,
    required: [true, 'Apellido de la persona']
  },
  sexo: {
    type: String,
    required: [true, 'Apellido de la persona']
  },
  estCiv: {
    type: String,
  },
  parro: {
    type: String,
  },
  muni: {
    type: String,
  },
  sect: {
    type: String,
  },
  cedula: {
    type: Number,
    required: [true, 'Cedula de la persona'],
    unique:true
  },
  direccion: {
    type: String
  },
  birthday:{
    type: Date,
    default:null
  },
  correo:{
    type: String
  },
  telefono:{
    type: String
  },
  status: {
    type: Boolean,
    default:true
  },
  human:{
    type:Boolean,
    required: [true, 'Tipo de persona']
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
module.exports = mongoose.model('Perdats', PerdatSchema);
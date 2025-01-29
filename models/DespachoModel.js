'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DespSchema = new Schema({
  codCil: {
    type: String,
    required: [true, 'Nombre de la persona'],
  },
  idperdats: {
    type: mongoose.Schema.ObjectId,
    ref: 'Perdats',
    unique:true
  },
  despacho: {
    type: Boolean,
    required: [true, 'Despacho'],
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
module.exports = mongoose.model('Despachos', DespSchema);
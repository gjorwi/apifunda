'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DependSchema = new Schema({
  dependCod: {
    type: String,
    required: [true, 'Id de la Dependencia'],
    unique:true
  },
  dependName: {
    type: String,
    required: [true, 'Nombre de la Dependencia'],
    unique:true
  },
  status: {
    type: Boolean,
    default:true
  },
},{ timestamps: true });
module.exports = mongoose.model('Dependencias', DependSchema);
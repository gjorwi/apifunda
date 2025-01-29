'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MuniSchema = new Schema({
  muniName: {
    type: String,
    required: [true, 'Nombre del municipio'],
    unique:true
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
module.exports = mongoose.model('Municipios', MuniSchema);
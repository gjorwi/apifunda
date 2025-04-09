'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var IntervSchema = new Schema({
  intervName: {
    type: String,
    required: [true, 'Nombre del intervencion'],
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
module.exports = mongoose.model('Intervenciones', IntervSchema);
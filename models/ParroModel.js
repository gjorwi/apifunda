'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ParroSchema = new Schema({
  parroName: {
    type: String,
    required: [true, 'Nombre de la parroquia'],
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
module.exports = mongoose.model('Parroquias', ParroSchema);
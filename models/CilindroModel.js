'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CilSchema = new Schema({
  codCil: {
    type: String,
    required: [true, 'Codigo cilindro'],
    unique:true
  },
  capCil: {
    type: String,
    required: [true, 'Capacidad cilindro'],
  },
  desCil: {
    type: String,
    required: [true, 'Descripcion cilindro'],
  },
  urlCil:{
    type: String,
    required: [true, 'Url cilindro'],
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
module.exports = mongoose.model('Cilindros', CilSchema);
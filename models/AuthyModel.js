'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuthySchema = new Schema({
    userId: {
        type: String,
        required: 'Id del Usuario',
        unique:true
      },
    token: {
        type: String,
        required: 'Token de acceso'
    },
    enterTime: {
        type: Date
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Authys', AuthySchema);
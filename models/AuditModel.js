'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuditSchema = new Schema({
    userId: {
        type: String,
        required: 'Id del Usuario'
      },
    process: {
        type: String,
        required: 'Nombre del Proceso'
    },
    menuItem: {
        type: String,
        required: 'item del menu'
    },
    modulo: {
        type: String,
        required: 'Nombre del Modulo'
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Audits', AuditSchema);
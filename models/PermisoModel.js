'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PermisoSchema = new Schema({
    userId: {
        type: String,
        required: 'Id del Usuario',
        unique:true
    },
    idperdats: {
        type: mongoose.Schema.ObjectId,
        ref: 'Perdats',
        unique:true
    },
    iduserdats: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        unique:true
    },
    human:{
        type:Boolean,
        required: [true, 'Tipo de permisos']
    },
    status: {
        type: Boolean,
        default:true
    },
    modulos: {
        type: [Object],
        validate: [v => Array.isArray(v) && v.length > 0,"Modulos de acceso"]
    },
    Updated_date: {
        type: Date,
        default:""
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Permisos', PermisoSchema);
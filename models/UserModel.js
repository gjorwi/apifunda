'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: [true, 'Id del Usuario']
        
    },
    idperdats: {
        type: mongoose.Schema.ObjectId,
        ref: 'Perdats',
        unique:true
    },
    usuario: {
        type: String,
        unique: true,
        required: [true, 'Nombre del Usuario']
    },
    clave: {
        type: String,
        required: [true, 'Clave del Usuario']
    },
    status: {
        type: Boolean,
        default:true
    },
    human:{
        type:Boolean,
        required:[true, 'Tipo de Usuario']
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
module.exports = mongoose.model('Users', UserSchema);
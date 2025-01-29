'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AfiliadoSchema = new Schema({
    afilId: {
        type: String,
        unique: true,
        required: [true, 'Id del afiliado']
    },
    idperdats: {
        type: mongoose.Schema.ObjectId,
        ref: 'Perdats',
        required: [true, 'Id de datos persona']
    },
    type: {
        type: String,
        required: [true, 'Tipo de afiliado']
    },
    depend: {
        type: String,
        required: [true, 'Dependencia']
    },
    depart: {
        type: String,
        required: [true, 'Departamento']
    },
    nomi: {
        type: String,
        required: [true, 'Nomina']
    },
    parent: {
        type: String,
        required: [true, 'Parentesco']
    },
    cedpad: {
        type: String,
        required: [true, 'Cedula padre']
    },
    cedmad: {
        type: String,
        required: [true, 'Cedula madre']
    },
    cedtit: {
        type: String,
        required: [true, 'Cedula titular']
    },
    idtitdats: {
        type: mongoose.Schema.ObjectId,
        ref: 'Perdats',
        required: [true, 'Datos del titular']
    },
    fechinglab:{
        type: String,
    },
    docanex: {
        docced: {
            type: Boolean
        },
        docnomb: {
            type: Boolean
        },
        docrecpag: {
            type: Boolean
        }
    },
    reqdocanex: {
        actMat:{
            type: String
        },
        cedEsp:{
            type: String
        },
        partNacTit:{
            type: String
        },
        cedPad:{
            type: String
        },
        partNacHij:{
            type: String
        },
        infMed:{
            type: String
        },
        cedHij:{
            type: String
        },
        cartSolt:{
            type: String
        },
        depEcon:{
            type: String
        },
        constEst:{
            type: String
        }
    },
    obs: {
        type: String
    },
    identificador: {
        type: String,
        default:'AFILIADO'
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
module.exports = mongoose.model('Afiliados', AfiliadoSchema);
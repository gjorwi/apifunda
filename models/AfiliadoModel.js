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
    condicion:{
        type: Boolean,
        default: false
    },
    verifyMayores:{
        type: Boolean,
        default: false
    },
    docanex: {
        docced: {
            type: Boolean,
            default: false
        },
        docnomb: {
            type: Boolean,
            default: false
        },
        docrecpag: {
            type: Boolean,
            default: false
        }
    },
    reqdocanex: {
        actMat:{
            type: String,
            default: "false"
        },
        cedEsp:{
            type: String,
            default: "false"
        },
        disMat:{
            type: String,
            default: "false"
        },
        actDef:{
            type: String,
            default: "false"
        },
        autRet:{
            type: String,
            default: "false"
        },
        partNacTit:{
            type: String,
            default: "false"
        },
        cedHij9A:{
            type: String,
            default: "false"
        },
        constEst:{
            type: String,
            default: "false"
        },
        cartSolt:{
            type: String,
            default: "false"
        },
        cartDepEco:{
            type: String,
            default: "false"
        },
        carDisc:{
            type: String,
            default: "false"
        },
        certPartNac:{
            type: String,
            default: "false"
        },
        cedPadres:{
            type: String,
            default: "false"
        }
    },
    obs: {
        type: String,
        default:""
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
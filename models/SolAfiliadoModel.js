'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SolAfiliadoSchema = new Schema({
    afilId: {
        type: String,
        required: [true, 'Id del afiliado']
    },
    nombre: {
        type: String,
        required: [true, 'Nombre de la persona']
    },
    apellido: {
        type: String,
        required: [true, 'Apellido de la persona']
    },
    sexo: {
        type: String,
        required: [true, 'Apellido de la persona']
    },
    estCiv: {
        type: String,
    },
    parro: {
        type: String,
    },
    muni: {
        type: String,
    },
    sect: {
        type: String,
    },
    cedula: {
        type: Number,
        required: [true, 'Cedula de la persona']
    },
    direccion: {
        type: String
    },
    birthday:{
        type: Date,
    },
    correo:{
        type: String
    },
    telefono:{
        type: String
    },
    human:{
        type:Boolean,
        required: [true, 'Tipo de persona']
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
    fechinglab:{
        type: String,
        required: [true, 'Fecha de ingreso laboral']
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
        // partNacTit:{
        //     type: String,
        //     default: "false"
        // },
        partNacHij:{
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
        },
        actDef:{
            type: String,
            default: "false"
        },
        autRet:{
            type: String,
            default: "false"
        },
    },
    obs: {
        type: String
    },
    statusAfil: {
        type: Boolean,
        default:true
    },
    status: {
        type: Boolean,
        default:true
    },
    proceso: {
        type: String,
        default:"pendiente"
    },
    respaprob: {
        type: String,
        default:"En espera de revisión"
    },
    idUserDatsCreate: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        default:null
    },
    idUserDatsUpdate: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        default:null
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
module.exports = mongoose.model('SolAfiliados', SolAfiliadoSchema);
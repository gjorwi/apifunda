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